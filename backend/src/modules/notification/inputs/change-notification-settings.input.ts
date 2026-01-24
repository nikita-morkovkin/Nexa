import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangeNotificationsSettingsInput {
  @Field(() => Boolean)
  public siteNotifications: boolean;

  @Field(() => Boolean)
  public telegramNotifications: boolean;
}
