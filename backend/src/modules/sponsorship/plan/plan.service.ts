import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type User } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { StripeService } from 'src/modules/libs/stripe/stripe.service';
import { CreatePlanInput } from './inputs/create-plan.input';

@Injectable()
export class PlanService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  public async findMyPlans(user: User) {
    const plans = await this.prismaService.sponsorshipPlan.findMany({
      where: {
        userId: user.id,
      },
    });

    return plans;
  }

  public async create(user: User, input: CreatePlanInput) {
    const { price, title, description } = input;

    const channel = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!channel?.isVerified) {
      throw new ForbiddenException(
        'Создание планов доступно только для верифицированных каналов',
      );
    }

    const stripePlan = await this.stripeService.plans.create({
      amount: Math.floor(price * 100),
      currency: 'rub',
      interval: 'month',
      product: {
        name: title,
      },
    });

    await this.prismaService.sponsorshipPlan.create({
      data: {
        title,
        description,
        price,
        stripePlanId: stripePlan.id,
        // WARNING: Stripe product id maybe null
        stripeProductId: stripePlan.product as string,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return true;
  }

  public async remove(planId: string) {
    const plan = await this.prismaService.sponsorshipPlan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      throw new NotFoundException('План не был найден');
    }

    try {
      await this.stripeService.plans.del(plan.stripePlanId);
    } catch (error: any) {
      throw new Error('Не удалось удалить план по идентификатору', error);
    }

    try {
      await this.stripeService.products.del(plan.stripeProductId);
    } catch (error: any) {
      throw new Error('Не удалось удалить продукт по идентификатору', error);
    }

    await this.prismaService.sponsorshipPlan.delete({
      where: {
        id: planId,
      },
    });

    return true;
  }
}
