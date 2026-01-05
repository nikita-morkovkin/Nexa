import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { ms, StringValue } from '../../shared/utils/ms.util';
import parseBoolean from '../../shared/utils/parse-boolean.util';
import { RedisService } from '../redis/redis.service';

export const createSessionMiddleware = (
  config: ConfigService,
  redis: RedisService,
) => {
  const sessionSecret = config.getOrThrow<string>('SESSION_SECRET');
  const sessionName = config.getOrThrow<string>('SESSION_NAME');
  const sessionDomain = config.getOrThrow<string>('SESSION_DOMAIN');
  const sessionMaxAge = ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE'));
  const sessionPrefix = config.getOrThrow<string>('SESSION_PREFIX');
  const sessionHttpOnly = parseBoolean(
    config.getOrThrow<string>('SESSION_HTTP_ONLY'),
  );
  const sessionSecure = parseBoolean(
    config.getOrThrow<string>('SESSION_SECURE'),
  );

  const redisStore = new RedisStore({
    client: redis,
    prefix: sessionPrefix,
    ttl: Math.floor(sessionMaxAge / 1000),
    disableTouch: true,
  });

  return session({
    secret: sessionSecret,
    name: sessionName,
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      domain: sessionDomain,
      maxAge: sessionMaxAge,
      httpOnly: sessionHttpOnly,
      secure: sessionSecure,
      sameSite: 'lax',
    },
    store: redisStore,
  });
};
