import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SponsorshipPlan } from 'generated/prisma/client';
import { UserModel } from 'src/modules/auth/account/models/user.model';

@ObjectType()
export class PlanModel implements SponsorshipPlan {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public title: string;

  @Field(() => String, { nullable: true })
  public description: string | null;

  @Field(() => Number)
  public price: number;

  @Field(() => String)
  public stripeProductId: string;

  @Field(() => String)
  public stripePlanId: string;

  @Field(() => String)
  public userId: string;

  @Field(() => UserModel)
  public user: UserModel;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
