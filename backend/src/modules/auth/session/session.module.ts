import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { VerificationModule } from '../verification/verification.module';
import { SessionResolver } from './session.resolver';
import { SessionService } from './session.service';

@Module({
  imports: [PrismaModule, ConfigModule, VerificationModule],
  providers: [SessionResolver, SessionService],
})
export class SessionModule {}
