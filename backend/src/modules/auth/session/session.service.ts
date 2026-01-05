import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import type { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LoginInput } from './inputs/login.input';

@Injectable()
export class SessionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async login(@Req() req: Request, input: LoginInput) {
    const { login, password } = input;

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: { equals: login } }, { email: { equals: login } }],
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.createdAt = new Date();

      req.session.save(err => {
        if (err) {
          console.error('Session save detail:', err);
          return reject(
            new InternalServerErrorException('Ошибка при сохранении сессии'),
          );
        }
        resolve(user);
      });
    });
  }

  public async logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy(err => {
        if (err) {
          return reject(
            new InternalServerErrorException('Ошибка при удалении сессии'),
          );
        }

        req.res?.clearCookie(
          this.configService.getOrThrow<string>('SESSION_NAME'),
        );
        resolve(true);
      });
    });
  }
}
