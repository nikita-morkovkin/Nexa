import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { MailModule } from 'src/modules/libs/mail/mail.module';
import { PasswordRecoveryResolver } from './password-recovery.resolver';
import { PasswordRecoveryService } from './password-recovery.service';

@Module({
  imports: [MailModule, PrismaModule],
  providers: [PasswordRecoveryResolver, PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
