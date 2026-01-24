import { Injectable } from '@nestjs/common';
import {
  NotificationType,
  type SponsorshipPlan,
  TokenType,
  type User,
} from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { generateToken } from 'src/shared/utils/generate-token.util';
import { ChangeNotificationsSettingsInput } from './inputs/change-notification-settings.input';

@Injectable()
export class NotificationService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findUnreadCount(user: User) {
    const count = await this.prismaService.notification.count({
      where: {
        isRead: false,
        userId: user.id,
      },
    });

    return count;
  }

  public async findByUser(user: User) {
    await this.prismaService.notification.updateMany({
      where: {
        isRead: false,
        userId: user.id,
      },
      data: {
        isRead: true,
      },
    });

    const notifications = await this.prismaService.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications;
  }

  public async createNewSponsorship(userId: string, plan: SponsorshipPlan) {
    await this.prismaService.notification.create({
      data: {
        userId,
        type: NotificationType.NEW_SPONSOR,
        message: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Новый спонсор</title>
</head>
<body>
  <p>Ваш спонсор подписался на план ${plan.title}</p>
</body>
</html>`,
      },
    });
  }

  public async changeSettings(
    user: User,
    input: ChangeNotificationsSettingsInput,
  ) {
    const { siteNotifications, telegramNotifications } = input;

    const notificationSettings =
      await this.prismaService.notificationSettings.upsert({
        where: {
          userId: user.id,
        },
        update: {
          siteNotifications,
          telegramNotifications,
        },
        create: {
          siteNotifications,
          telegramNotifications,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
        include: {
          user: true,
        },
      });

    const userWithTelegram = await this.prismaService.user.findUnique({
      where: { id: user.id },
      select: { telegramId: true },
    });

    if (telegramNotifications && !userWithTelegram?.telegramId) {
      const tgAuthToken = await generateToken(
        this.prismaService,
        user,
        TokenType.TELEGRAM_AUTH,
      );

      return {
        notificationSettings,
        telegramAuthToken: tgAuthToken.token,
      };
    }

    if (!telegramNotifications && userWithTelegram?.telegramId) {
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          telegramId: null,
        },
      });

      const updatedSettings =
        await this.prismaService.notificationSettings.findUnique({
          where: {
            userId: user.id,
          },
          include: {
            user: true,
          },
        });

      return { notificationSettings: updatedSettings! };
    }

    return { notificationSettings };
  }

  public async createStreamStart(userId: string, channel: User) {
    const notification = await this.prismaService.notification.create({
      data: {
        message: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Новый стрим начался</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #9146ff;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 16px;
    }
    .button {
      display: inline-block;
      margin-top: 16px;
      padding: 12px 24px;
      background-color: #9146ff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      padding: 20px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      background-color: #f9f9f9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Стрим начался!</h1>
    </div>
    <div class="content">
      <p>Привет! Автор <strong>${channel.username}</strong> начал новый стрим.</p>
      <p>Не пропусти трансляцию — присоединяйся прямо сейчас!</p>
      <a class="button" href="#">Смотреть стрим</a>
    </div>
    <div class="footer">
      Это письмо сформировано автоматически, пожалуйста, не отвечайте на него.
    </div>
  </div>
</body>
</html>`,
        type: NotificationType.STREAM_START,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return notification;
  }

  public async createNewFollowing(userId: string, follower: User) {
    const notification = await this.prismaService.notification.create({
      data: {
        message: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Новый подписчик</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #9146ff;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 16px;
    }
    .footer {
      padding: 20px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      background-color: #f9f9f9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Новый подписчик!</h1>
    </div>
    <div class="content">
      <p>Ура! На вас подписался новый пользователь: <strong>${follower.username}</strong>.</p>
      <p>Ваше сообщество растет!</p>
    </div>
    <div class="footer">
      Это письмо сформировано автоматически, пожалуйста, не отвечайте на него.
    </div>
  </div>
</body>
</html>`,
        type: NotificationType.NEW_FOLLOWER,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return notification;
  }

  public async createEnable2FA(userId: string) {
    const notification = await this.prismaService.notification.create({
      data: {
        message: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Двухфакторная аутентификация включена</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #9146ff;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 16px;
    }
    .footer {
      padding: 20px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      background-color: #f9f9f9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>2FA включена!</h1>
    </div>
    <div class="content">
      <p>Поздравляем! Двухфакторная аутентификация успешно включена на вашем аккаунте.</p>
      <p>Ваш аккаунт теперь защищён дополнительным уровнем безопасности.</p>
    </div>
    <div class="footer">
      Это письмо сформировано автоматически, пожалуйста, не отвечайте на него.
    </div>
  </div>
</body>
</html>`,
        type: NotificationType.ENABLE_TWO_FACTOR_AUTH,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return notification;
  }

  public async createVerifyChannel(userId: string) {
    const notification = await this.prismaService.notification.create({
      data: {
        message: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Аккаунт подтверждён</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #9146ff;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 16px;
    }
    .footer {
      padding: 20px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      background-color: #f9f9f9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Аккаунт подтверждён!</h1>
    </div>
    <div class="content">
      <p>Поздравляем! Ваш аккаунт успешно прошёл проверку и подтверждён.</p>
      <p>Теперь вам доступны все возможности платформы.</p>
    </div>
    <div class="footer">
      Это письмо сформировано автоматически, пожалуйста, не отвечайте на него.
    </div>
  </div>
</body>
</html>`,
        type: NotificationType.VERIFIED_CHANNEL,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return notification;
  }
}
