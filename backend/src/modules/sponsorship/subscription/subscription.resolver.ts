import { Query, Resolver } from '@nestjs/graphql';
import type { User } from 'generated/prisma/client';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { SubscriptionModel } from './models/subscription.model';
import { SubscriptionService } from './subscription.service';

@Resolver('Subscription')
export class SubscriptionResolver {
  public constructor(
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Query(() => [SubscriptionModel], { name: 'findAllMySponsors' })
  @Authorization()
  public async findAllMySponsors(@Authorized() user: User) {
    return this.subscriptionService.findMySponsors(user);
  }
}
