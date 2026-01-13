import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User } from 'generated/prisma/client';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { ChangeNotificationSettingsInput } from './inputs/change-notification-settings.input';
import { ChangeNotificationSettingsModel } from './models/notification-settings.model';
import { NotificationModel } from './models/notification.model';
import { NotificationService } from './notification.service';

@Resolver('Notification')
export class NotificationResolver {
  public constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Query(() => Int, { name: 'findUnreadNotificationCount' })
  @Authorization()
  public async findUnreadCount(@Authorized() user: User) {
    return this.notificationService.findUnreadCount(user);
  }

  @Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
  @Authorization()
  public async findByUser(@Authorized() user: User) {
    return this.notificationService.findByUser(user);
  }

  @Mutation(() => ChangeNotificationSettingsModel, {
    name: 'changeNotificationSettings',
  })
  @Authorization()
  public async changeSettings(
    @Authorized() user: User,
    @Args('data') data: ChangeNotificationSettingsInput,
  ) {
    return this.notificationService.changeSettings(user, data);
  }
}
