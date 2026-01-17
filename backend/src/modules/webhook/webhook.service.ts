import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionStatus } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import Stripe from 'stripe';
import { LivekitService } from '../libs/livekit/livekit.service';
import { StripeService } from '../libs/stripe/stripe.service';
import { TelegramService } from '../libs/telegram/telegram.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class WebhookService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly livekitService: LivekitService,
    private readonly notificationService: NotificationService,
    private readonly telegramService: TelegramService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  // Third param is temp - it can call an error with auth token and different times on servers
  public async receiveWebhookEvent(body: string, authorization: string) {
    const event = this.livekitService.receiver.receive(
      body,
      authorization,
      true,
    );

    if (event.event === 'ingress_started') {
      const ingressId = event.ingressInfo?.ingressId;

      if (!ingressId) {
        return;
      }

      const stream = await this.prismaService.stream.update({
        where: {
          ingressId,
        },
        data: {
          isLive: true,
        },
        include: {
          user: true,
        },
      });

      if (!stream.user) {
        return;
      }

      const followers = await this.prismaService.follow.findMany({
        where: {
          followingId: stream.user.id,
          follower: {
            isDeactivated: false,
          },
        },
        include: {
          follower: {
            include: {
              notificationSettings: true,
            },
          },
        },
      });

      for (const follow of followers) {
        const follower = follow.follower;

        if (follower.notificationSettings?.siteNotifications) {
          await this.notificationService.createStreamStart(
            follower.id,
            stream.user,
          );
        }

        if (
          follower.notificationSettings?.telegramNotifications &&
          follower.telegramId
        ) {
          await this.telegramService.sendStreamStart(
            follower.telegramId,
            stream.user,
          );
        }
      }
    }

    if (event.event === 'ingress_ended') {
      const ingressId = event.ingressInfo?.ingressId;

      if (!ingressId) {
        return;
      }

      const stream = await this.prismaService.stream.update({
        where: {
          ingressId,
        },
        data: {
          isLive: false,
        },
      });

      await this.prismaService.chatMessage.deleteMany({
        where: {
          streamId: stream.id,
        },
      });
    }
  }

  public async receiveWebhookStripe(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
      const planId = session.metadata?.planId;
      const subscriberId = session.metadata?.userId;
      const channelId = session.metadata?.channelId;

      if (!planId || !subscriberId || !channelId) {
        return;
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const sponsorshipSubscription =
        await this.prismaService.sponsorshipSubscription.create({
          data: {
            expiresAt,
            planId,
            subscriberId,
            channelId,
          },
          include: {
            plan: true,
            subscriber: true,
            channel: {
              include: {
                notificationSettings: true,
              },
            },
          },
        });

      await this.prismaService.transaction.updateMany({
        where: {
          stripeSubscriptionId: session.id,
          status: TransactionStatus.PENDING,
        },
        data: {
          status: TransactionStatus.SUCCESS,
        },
      });

      if (
        sponsorshipSubscription.channel.notificationSettings?.siteNotifications
      ) {
        await this.notificationService.createNewSponsorship(
          sponsorshipSubscription.channel.id,
          sponsorshipSubscription.plan,
        );
      }

      if (
        sponsorshipSubscription.channel.notificationSettings
          ?.telegramNotifications &&
        sponsorshipSubscription.channel.telegramId
      ) {
        await this.telegramService.sendNewSponsorship(
          sponsorshipSubscription.channel.telegramId,
          sponsorshipSubscription.plan,
          sponsorshipSubscription.subscriber,
        );
      }
    }

    if (event.type === 'checkout.session.expired') {
      await this.prismaService.transaction.updateMany({
        where: {
          stripeSubscriptionId: session.id,
          status: TransactionStatus.PENDING,
        },
        data: {
          status: TransactionStatus.EXPIRED,
        },
      });
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      await this.prismaService.transaction.updateMany({
        where: {
          stripeSubscriptionId: session.id,
          status: TransactionStatus.PENDING,
        },
        data: {
          status: TransactionStatus.FAILED,
        },
      });
    }
  }

  // Don't pay attention to it, it works only such syntax
  // eslint-disable-next-line
  public async constructStripeEvent(payload: any, signature: any) {
    return this.stripeService.webhooks.constructEvent(
      payload,
      signature,
      this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
    );
  }
}
