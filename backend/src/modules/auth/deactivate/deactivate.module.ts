import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { RedisModule } from 'src/core/redis/redis.module';
import { TelegramModule } from 'src/modules/libs/telegram/telegram.module';
import { DeactivateResolver } from './deactivate.resolver';
import { DeactivateService } from './deactivate.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    MailerModule,
    TelegramModule,
    RedisModule,
  ],
  providers: [DeactivateResolver, DeactivateService],
})
export class DeactivateModule {}
