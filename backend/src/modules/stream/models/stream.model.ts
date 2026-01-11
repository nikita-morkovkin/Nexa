import { Field, ObjectType } from '@nestjs/graphql';
import type { Stream } from 'generated/prisma/client';
import { CategoryModel } from 'src/modules/category/models/category.model';
import { UserModel } from '../../auth/account/models/user.model';

@ObjectType()
export class StreamModel implements Stream {
  @Field(() => String)
  public id: string;

  @Field(() => String)
  public title: string;

  @Field(() => String, { nullable: true })
  public thumbnailUrl: string | null;

  @Field(() => String, { nullable: true })
  public ingressId: string | null;

  @Field(() => String, { nullable: true })
  public serverUrl: string | null;

  @Field(() => String, { nullable: true })
  public streamKey: string | null;

  @Field(() => Boolean)
  public isLive: boolean;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;

  @Field(() => UserModel, { nullable: true })
  public user?: UserModel;

  @Field(() => String)
  public categoryId: string;

  @Field(() => CategoryModel)
  public category: CategoryModel;
}
