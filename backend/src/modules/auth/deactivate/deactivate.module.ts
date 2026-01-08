import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { DeactivateResolver } from './deactivate.resolver';
import { DeactivateService } from './deactivate.service';

@Module({
  imports: [PrismaModule, ConfigModule, MailerModule],
  providers: [DeactivateResolver, DeactivateService],
})
export class DeactivateModule {}
