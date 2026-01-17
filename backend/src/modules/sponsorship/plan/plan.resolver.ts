import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { type User } from 'generated/prisma/client';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { CreatePlanInput } from './inputs/create-plan.input';
import { PlanModel } from './models/plan.model';
import { PlanService } from './plan.service';

@Resolver('Plan')
export class PlanResolver {
  public constructor(private readonly planService: PlanService) {}

  @Query(() => [PlanModel], { name: 'findMySponsorshipPlans' })
  @Authorization()
  public async findMyPlans(@Authorized() user: User) {
    return this.planService.findMyPlans(user);
  }

  @Mutation(() => Boolean, { name: 'createSponsorshipPlan' })
  @Authorization()
  public async createPlan(
    @Authorized() user: User,
    @Args('data') data: CreatePlanInput,
  ) {
    return this.planService.create(user, data);
  }

  @Mutation(() => Boolean, { name: 'removeSponsorshipPlan' })
  @Authorization()
  public async removePlan(@Args('planId') planId: string) {
    return this.planService.remove(planId);
  }
}
