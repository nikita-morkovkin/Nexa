import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Notification, NotificationType } from 'generated/prisma/client';
import { UserModel } from 'src/modules/auth/account/models/user.model';

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

@ObjectType()
export class NotificationModel implements Notification {
  @Field(() => String)
  public id: string;

  @Field(() => String, { nullable: true })
  public userId: string | null;

  @Field(() => UserModel, { nullable: true })
  public user: UserModel | null;

  @Field(() => String)
  public message: string;

  @Field(() => NotificationType)
  public type: NotificationType;

  @Field(() => Boolean)
  public isRead: boolean;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
