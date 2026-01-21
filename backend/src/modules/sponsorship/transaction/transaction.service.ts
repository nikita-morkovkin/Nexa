import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type User } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { StripeService } from 'src/modules/libs/stripe/stripe.service';

@Injectable()
export class TransactionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
  ) {}

  public async findMyTransactions(user: User) {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId: user.id,
      },
    });

    return transactions;
  }

  public async makePayment(user: User, planId: string) {
    const plan = await this.prismaService.sponsorshipPlan.findUnique({
      where: {
        id: planId,
      },
      include: {
        user: true,
      },
    });

    if (!plan) {
      throw new NotFoundException('План не найден');
    }

    // plan.user.id maybe null
    if (user.id === plan.user?.id) {
      throw new ConflictException('Нельзя оформить спонсорство на самого себя');
    }

    const existingSubscription =
      await this.prismaService.sponsorshipSubscription.findFirst({
        where: {
          subscriberId: user.id,
          // WARNING: It is not safe to use non-null operator
          channelId: plan.userId,
        },
      });

    if (existingSubscription) {
      throw new ConflictException('Вы уже оформили спонсорство на этот канал');
    }

    const customer = await this.stripeService.customers.create({
      name: user.username,
      email: user.email,
    });

    const session = await this.stripeService.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'rub',
            product_data: {
              name: plan.title,
              description: plan.description ?? '',
            },
            unit_amount: Math.round(plan.price * 100),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.getOrThrow('ALLOWED_ORIGINS')}
      /success?price=${encodeURIComponent(plan.title)}
      &username=${encodeURIComponent(user.username)}`,
      cancel_url: `${this.configService.getOrThrow('ALLOWED_ORIGINS')}`,
      customer: customer.id,
      metadata: {
        planId: plan.id,
        userId: user.id,
        channelId: plan.userId,
      },
    });

    await this.prismaService.transaction.create({
      data: {
        amount: plan.price,
        currency: session.currency as string,
        // It works normal, but it didn't manage to do it without this ignore
        // eslint-disable-next-line
        // @ts-ignore
        stripeSubscriptionId: session.id,
        userId: user.id,
      },
    });

    return { url: session.url };
  }
}
