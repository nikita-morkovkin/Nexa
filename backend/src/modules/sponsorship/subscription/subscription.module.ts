import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { SubscriptionService } from './subscription.service';
import { SubscriptionResolver } from './subscription.resolver';

@Module({
  imports: [PrismaModule],
  providers: [SubscriptionResolver, SubscriptionService],
})
export class SubscriptionModule {}
