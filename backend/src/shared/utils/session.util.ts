import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { User } from 'generated/prisma/client';
import type { SessionMetadata } from '../types/session-metadata.types';

export function saveSession(
  req: Request,
  user: User,
  userAgent: SessionMetadata,
) {
  return new Promise((resolve, reject) => {
    req.session.userId = user.id;
    req.session.createdAt = new Date();
    req.session.metadata = userAgent;

    req.session.save(err => {
      if (err) {
        return reject(
          new InternalServerErrorException('Ошибка при сохранении сессии'),
        );
      }
      resolve(user);
    });
  });
}

export function destroySession(
  req: Request,
  config: ConfigService,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) {
        return reject(
          new InternalServerErrorException('Ошибка при удалении сессии'),
        );
      }

      req.res?.clearCookie(config.getOrThrow<string>('SESSION_NAME'));
      resolve(true);
    });
  });
}
