import { Field, ID, ObjectType } from '@nestjs/graphql';
import { NotificationSettings } from 'generated/prisma/client';
import { UserModel } from 'src/modules/auth/account/models/user.model';

@ObjectType()
export class NotificationSettingsModel implements NotificationSettings {
  @Field(() => ID)
  public userId: string;

  @Field(() => ID)
  public id: string;

  @Field(() => Boolean)
  public siteNotifications: boolean;

  @Field(() => Boolean)
  public telegramNotifications: boolean;

  @Field(() => UserModel)
  public user: UserModel;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}

@ObjectType()
export class ChangeNotificationSettingsModel {
  @Field(() => NotificationSettingsModel)
  public notificationSettings: NotificationSettingsModel;

  @Field(() => String, { nullable: true })
  public telegramAuthToken?: string;
}
