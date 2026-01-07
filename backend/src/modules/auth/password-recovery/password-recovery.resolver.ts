import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import type { GqlContext } from 'src/shared/types/gql-context.types';
import { NewPasswordInput } from './inputs/new-password.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { PasswordRecoveryService } from './password-recovery.service';

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
  public constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @Mutation(() => Boolean, { name: 'resetPassword' })
  public async resetPassword(
    @Context() { req }: GqlContext,
    @Args('data') data: ResetPasswordInput,
    @UserAgent() userAgent: string,
  ) {
    return await this.passwordRecoveryService.resetPassword(
      req,
      data,
      userAgent,
    );
  }

  @Mutation(() => Boolean, { name: 'newPassword' })
  public async newPassword(@Args('data') data: NewPasswordInput) {
    return await this.passwordRecoveryService.newPassword(data);
  }
}
