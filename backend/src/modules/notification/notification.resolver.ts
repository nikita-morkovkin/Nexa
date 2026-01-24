import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User } from 'generated/prisma/client';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { ChangeNotificationsSettingsInput } from './inputs/change-notification-settings.input';
import {
  ChangeNotificationSettingsModel as ChangeNotificationsSettingsModel,
  NotificationsSettingsModel,
} from './models/notification-settings.model';
import { NotificationModel } from './models/notification.model';
import { NotificationService } from './notification.service';

@Resolver('Notification')
export class NotificationResolver {
  public constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Query(() => Int, { name: 'findUnreadNotificationsCount' })
  @Authorization()
  public async findUnreadCount(@Authorized() user: User) {
    return this.notificationService.findUnreadCount(user);
  }

  @Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
  @Authorization()
  public async findByUser(@Authorized() user: User) {
    return this.notificationService.findByUser(user);
  }

  @Query(() => NotificationsSettingsModel, {
    name: 'findNotificationsSettings',
  })
  @Authorization()
  public async findSettings(@Authorized() user: User) {
    return this.notificationService.findSettings(user);
  }

  @Mutation(() => ChangeNotificationsSettingsModel, {
    name: 'changeNotificationsSettings',
  })
  @Authorization()
  public async changeSettings(
    @Authorized() user: User,
    @Args('data') data: ChangeNotificationsSettingsInput,
  ) {
    return this.notificationService.changeSettings(user, data);
  }
}
