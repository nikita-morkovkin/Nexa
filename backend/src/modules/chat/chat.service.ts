import { BadRequestException, Injectable } from '@nestjs/common';
import type { User } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input';
import { SendMessageInput } from './inputs/send-message.input';

@Injectable()
export class ChatService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findMessagesByStream(streamId: string) {
    const messages = await this.prismaService.chatMessage.findMany({
      where: {
        streamId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });

    return messages;
  }

  public async sendMessage(userId: string, input: SendMessageInput) {
    const { text, streamId } = input;

    const stream = await this.prismaService.stream.findUnique({
      where: {
        id: streamId,
      },
    });

    if (!stream) {
      throw new Error('Стрим не найден');
    }

    if (!stream.isLive) {
      throw new BadRequestException('Стрим не в режиме живого вещания');
    }

    if (!stream.isChatEnabled) {
      throw new BadRequestException('Чат отключен для этого стрима');
    }

    const message = await this.prismaService.chatMessage.create({
      data: {
        text,
        user: {
          connect: {
            id: userId,
          },
        },
        stream: {
          connect: {
            id: stream.id,
          },
        },
      },
      include: {
        user: true,
        stream: true,
      },
    });

    return message;
  }

  public async changeSettings(user: User, input: ChangeChatSettingsInput) {
    const { isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly } =
      input;

    await this.prismaService.stream.update({
      where: {
        id: user.streamId,
      },
      data: {
        isChatEnabled,
        isChatFollowersOnly,
        isChatPremiumFollowersOnly,
      },
    });

    return true;
  }
}
