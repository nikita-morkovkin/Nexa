import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import type { Request } from 'express';
import { TokenType } from 'generated/prisma/enums';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { generateToken } from 'src/shared/utils/generate-token.util';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { NewPasswordInput } from './inputs/new-password.input';
import { ResetPasswordInput } from './inputs/reset-password.input';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async resetPassword(
    req: Request,
    input: ResetPasswordInput,
    userAgent: string,
  ) {
    const { email } = input;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь с такой почтой не найден');
    }

    const resetToken = await generateToken(
      this.prismaService,
      user,
      TokenType.PASSWORD_RESET,
    );

    const metadata = getSessionMetadata(req, userAgent);

    try {
      await this.mailService.sendPasswordRecoveryToken(
        user.email,
        resetToken.token,
        metadata,
      );
    } catch {
      throw new BadRequestException(
        'Не удалось отправить письмо для сброса пароля',
      );
    }

    return true;
  }

  public async newPassword(input: NewPasswordInput) {
    const { token, newPassword } = input;

    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('Неверный токен');
    }

    const hasExpired = existingToken.expiresIn < new Date();

    if (hasExpired) {
      throw new BadRequestException('Токен истек');
    }

    await this.prismaService.user.update({
      where: {
        id: existingToken.id,
      },
      data: {
        password: await hash(newPassword),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });
  }
}
