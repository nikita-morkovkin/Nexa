import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StorageService } from 'src/core/libs/storage/storage.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from '../libs/mail/mail.service';
import { TelegramService } from '../libs/telegram/telegram.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly storageService: StorageService,
    private readonly telegramService: TelegramService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async deleteDeactivatedAccounts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deactivatedAccounts = await this.prismaService.user.findMany({
      where: {
        isDeactivated: true,
        deactivateAt: {
          lte: sevenDaysAgo,
        },
      },
      select: {
        id: true,
        email: true,
        avatar: true,
        telegramId: true,
        notificationSettings: {
          select: {
            telegramNotifications: true,
          },
        },
        stream: {
          select: {
            thumbnailUrl: true,
          },
        },
      },
    });

    if (deactivatedAccounts.length === 0) {
      return;
    }

    this.logger.log(
      `Found ${deactivatedAccounts.length} deactivated accounts to delete.`,
    );

    await Promise.allSettled(
      deactivatedAccounts.map(async user => {
        try {
          if (user.avatar) {
            await this.storageService.remove(user.avatar);
          }

          if (user.stream?.thumbnailUrl) {
            await this.storageService.remove(user.stream.thumbnailUrl);
          }

          await this.mailService.sendAccountDeletionEmail(user.email);

          if (
            user.notificationSettings?.telegramNotifications &&
            user.telegramId
          ) {
            await this.telegramService.sendAccountDeletedMessage(
              user.telegramId,
            );
          }
        } catch (error) {
          this.logger.error(
            `Failed to process account deletion for ${user.email}:`,
            error instanceof Error ? error.message : error,
          );
        }
      }),
    );

    const userIds = deactivatedAccounts.map(user => user.id);

    try {
      const { count } = await this.prismaService.user.deleteMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });

      this.logger.log(`Successfully deleted ${count} deactivated accounts.`);
    } catch (error) {
      this.logger.error(
        'Failed to delete deactivated accounts from database:',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  @Cron('0 0 */4 * *')
  public async notifyUsersEnable2FA() {
    const users = await this.prismaService.user.findMany({
      where: {
        isTotpEnabled: false,
      },
      include: {
        notificationSettings: true,
      },
    });

    if (users.length === 0) {
      return;
    }

    this.logger.log(`Notifying ${users.length} users to enable 2FA.`);

    // It uses Promise.allSettled for parallel work
    await Promise.allSettled(
      users.map(async user => {
        try {
          await this.mailService.sendEnable2FA(user.email);

          if (user.notificationSettings?.siteNotifications) {
            await this.notificationService.createEnable2FA(user.id);
          }

          if (
            user.notificationSettings?.telegramNotifications &&
            user.telegramId
          ) {
            await this.telegramService.sendEnable2FA(user.telegramId);
          }
        } catch (error) {
          this.logger.error(
            `Failed to notify user ${user.email} about 2FA:`,
            error instanceof Error ? error.message : error,
          );
        }
      }),
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async verifyChannels() {
    // Optimization: fetch only unverified users and pull follower count in a single query (Prisma aggregation).
    const users = await this.prismaService.user.findMany({
      where: {
        isVerified: false,
      },
      include: {
        notificationSettings: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    const usersToVerify = users.filter(user => user._count.followers > 10);

    if (usersToVerify.length === 0) {
      return;
    }

    this.logger.log(`Found ${usersToVerify.length} channels to verify.`);

    await Promise.allSettled(
      usersToVerify.map(async user => {
        try {
          await this.prismaService.user.update({
            where: {
              id: user.id,
            },
            data: {
              isVerified: true,
            },
          });

          await this.mailService.sendVerifyChannel(user.email);

          if (user.notificationSettings?.siteNotifications) {
            await this.notificationService.createVerifyChannel(user.id);
          }

          if (
            user.notificationSettings?.telegramNotifications &&
            user.telegramId
          ) {
            await this.telegramService.sendVerifyChannel(user.telegramId);
          }
        } catch (error) {
          this.logger.error(
            `Failed to verify channel for user ${user.email}:`,
            error instanceof Error ? error.message : error,
          );
        }
      }),
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async deleteAllNotifications() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await this.prismaService.notification.deleteMany({
      where: {
        createdAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }
}
