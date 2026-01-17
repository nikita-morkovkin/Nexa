import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Follow } from 'generated/prisma/client';
import { UserModel } from 'src/modules/auth/account/models/user.model';

@ObjectType()
export class FollowModel implements Follow {
  @Field(() => ID)
  public id: string;

  @Field(() => UserModel)
  public followingUser: UserModel;

  @Field(() => UserModel)
  public followerUser: UserModel;

  @Field(() => ID)
  public followerId: string;

  @Field(() => ID)
  public followingId: string;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
