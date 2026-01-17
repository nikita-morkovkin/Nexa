import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PlanResolver } from './plan.resolver';
import { PlanService } from './plan.service';

@Module({
  imports: [PrismaModule],
  providers: [PlanResolver, PlanService],
})
export class PlanModule {}
