import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [FollowResolver, FollowService],
})
export class FollowModule {}
