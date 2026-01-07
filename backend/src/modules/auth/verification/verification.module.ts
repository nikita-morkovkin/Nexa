import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { MailModule } from 'src/modules/libs/mail/mail.module';
import { VerificationResolver } from './verification.resolver';
import { VerificationService } from './verification.service';

@Module({
  providers: [VerificationResolver, VerificationService],
  imports: [MailModule, PrismaModule],
  exports: [VerificationService],
})
export class VerificationModule {}
