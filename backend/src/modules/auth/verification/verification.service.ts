import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User } from 'generated/prisma/client';
import { TokenType } from 'generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { generateToken } from 'src/shared/utils/generate-token.util';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import { saveSession } from 'src/shared/utils/session.util';
import { VerificationInput } from './inputs/verification.input';

@Injectable()
export class VerificationService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async verify(
    req: Request,
    input: VerificationInput,
    userAgent: string,
  ) {
    const { token } = input;
    let existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
      },
    });

    if (!existingToken) {
      existingToken = await this.prismaService.token.findFirst({
        where: {
          id: token,
        },
      });
    }

    if (!existingToken || existingToken.type !== TokenType.EMAIL_VERIFY) {
      throw new NotFoundException('Токен не найден');
    }

    const hasExpired = existingToken.expiresIn < new Date();

    if (hasExpired) {
      throw new BadRequestException('Токен истек');
    }

    if (!existingToken.userId) {
      throw new BadRequestException(
        'Неверный токен: нет связанного пользователя',
      );
    }

    const user = await this.prismaService.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        isEmailVerified: true,
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    });

    const metadata = getSessionMetadata(req, userAgent);

    return await saveSession(req, user, metadata);
  }

  public async sendVerificationEmail(user: User) {
    const { token } = await generateToken(
      this.prismaService,
      user,
      TokenType.EMAIL_VERIFY,
      true,
    );

    await this.mailService.sendVerificationToken(user.email, token);
    return true;
  }
}
