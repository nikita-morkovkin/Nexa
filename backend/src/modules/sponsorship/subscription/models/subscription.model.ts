import { Field, ObjectType } from '@nestjs/graphql';
import { SponsorshipSubscription } from 'generated/prisma/client';

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
  @Field(() => String)
  public id: string;

  @Field(() => String)
  public planId: string;

  @Field(() => String)
  public subscriberId: string;

  @Field(() => String)
  public channelId: string;

  @Field(() => Date)
  public expiresAt: Date;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
