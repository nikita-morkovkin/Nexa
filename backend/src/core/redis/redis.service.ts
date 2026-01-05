import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { interceptRedisSetCommand } from './redis-set.interceptor';

@Injectable()
export class RedisService extends Redis {
  public constructor(private readonly configService: ConfigService) {
    const host = configService.getOrThrow<string>('REDIS_HOST');
    const port = configService.getOrThrow<number>('REDIS_PORT');
    const password = configService.getOrThrow<string>('REDIS_PASSWORD');

    super({
      host,
      port,
      password,
    });

    this.on('connect', () => {
      console.log('Redis connected to:', { host, port });
    });

    this.on('error', err => {
      console.error('Redis error:', err);
    });

    interceptRedisSetCommand(this);
  }
}
