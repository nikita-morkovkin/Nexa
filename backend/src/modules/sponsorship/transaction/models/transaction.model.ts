import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Transaction, TransactionStatus } from 'generated/prisma/client';
import { UserModel } from 'src/modules/auth/account/models/user.model';

registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
});

@ObjectType()
export class TransactionModel implements Transaction {
  @Field(() => String)
  public id: string;

  @Field(() => Number)
  public amount: number;

  @Field(() => String)
  public currency: string;

  @Field(() => TransactionStatus)
  public status: TransactionStatus;

  @Field(() => String, { nullable: true })
  public stripeSubscriptionId: string | null;

  @Field(() => String, { nullable: true })
  public userId: string | null;

  @Field(() => UserModel, { nullable: true })
  public user: UserModel | null;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
