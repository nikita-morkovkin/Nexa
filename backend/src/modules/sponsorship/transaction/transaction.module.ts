import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';

@Module({
  imports: [PrismaModule],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
