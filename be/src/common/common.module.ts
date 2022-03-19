import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedisRepositoryService } from './redis-repository.service';

@Module({
  providers: [PrismaService, RedisRepositoryService],
  exports: [PrismaService, RedisRepositoryService],
})
export class CommonModule {}
