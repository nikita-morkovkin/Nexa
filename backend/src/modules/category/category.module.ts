import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';

@Module({
  imports: [PrismaModule],
  providers: [CategoryService, CategoryResolver],
})
export class CategoryModule {}
