import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { VerificationModule } from '../verification/verification.module';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Module({
  providers: [AccountResolver, AccountService],
  imports: [PrismaModule, VerificationModule],
})
export class AccountModule {}
