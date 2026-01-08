import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import type { User } from 'generated/prisma/client';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import type { GqlContext } from 'src/shared/types/gql-context.types';
import { AuthModel } from '../account/models/auth.model';
import { DeactivateService } from './deactivate.service';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';

@Resolver('Deactivate')
export class DeactivateResolver {
  public constructor(private readonly deactivateService: DeactivateService) {}

  @Mutation(() => AuthModel, { name: 'deactivateAccount' })
  @Authorization()
  public async deactivate(
    @Context() { req }: GqlContext,
    @Args('data') data: DeactivateAccountInput,
    @Authorized() user: User,
    @UserAgent() userAgent: string,
  ) {
    return this.deactivateService.deactivate(req, data, user, userAgent);
  }
}
