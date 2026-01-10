import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { StreamResolver } from './stream.resolver';
import { StreamService } from './stream.service';

@Module({
  imports: [PrismaModule],
  providers: [StreamResolver, StreamService],
})
export class StreamModule {}
