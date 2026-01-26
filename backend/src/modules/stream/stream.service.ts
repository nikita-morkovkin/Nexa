import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'generated/prisma/client';
import type { FileUpload } from 'graphql-upload-ts';
import { AccessToken } from 'livekit-server-sdk';
import sharp from 'sharp';
import { StorageService } from 'src/core/libs/storage/storage.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filters.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';

@Injectable()
export class StreamService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  public async findAll(input: FiltersInput) {
    const { searchTerm, skip, take } = input || {};

    const whereClause = searchTerm
      ? this.findBySearchTermFilter(searchTerm)
      : {};

    const streams = await this.prismaService.stream.findMany({
      take: take ?? 12,
      skip: skip ?? 0,
      where: {
        user: {
          isDeactivated: false,
        },
        ...whereClause,
      },
      include: {
        user: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return streams;
  }

  public async findRandomStreams() {
    const total = await this.prismaService.stream.count({
      where: {
        user: {
          isDeactivated: false,
        },
      },
    });

    if (total === 0) {
      return [];
    }

    const randomIndexes = new Set<number>();
    const countToTake = Math.min(total, 4);

    while (randomIndexes.size < countToTake) {
      const randomIndex = Math.floor(Math.random() * total);
      randomIndexes.add(randomIndex);
    }

    const streams = await Promise.all(
      Array.from(randomIndexes).map(index =>
        this.prismaService.stream.findFirst({
          where: {
            user: {
              isDeactivated: false,
            },
          },
          include: {
            user: true,
            category: true,
          },
          skip: index,
        }),
      ),
    );

    return streams;
  }

  private generateFakeStreams() {
    const fakeData = [
      {
        title: 'Мы играем в Бравл Старс! Прокачка до 30 ранга',
        category: { title: 'Brawl Stars', slug: 'brawl-stars' },
        username: 'BrawlMaster',
      },
      {
        title: 'Проходим GTA 6 | Первые миссии на ультрах',
        category: { title: 'GTA VI', slug: 'gta-vi' },
        username: 'RockstarGamer',
      },
      {
        title: 'Утренний Чилл | Общаемся и смотрим видосы',
        category: { title: 'Just Chatting', slug: 'just-chatting' },
        username: 'StreamerGirl',
      },
      {
        title: 'ФИНАЛ ТУРНИРА ПО COUNTER-STRIKE 2',
        category: { title: 'Counter-Strike 2', slug: 'cs2' },
        username: 'CyberPro',
      },
    ];

    return fakeData.map((data, i) => ({
      id: `fake-${i}`,
      title: data.title,
      thumbnailUrl: `https://picsum.photos/400/225?random=${i}`,
      isLive: true,
      user: {
        id: `fake-user-${i}`,
        username: data.username,
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.username}`,
        isVerified: i % 2 === 0,
      },
      category: {
        id: `fake-category-${i}`,
        ...data.category,
      },
    }));
  }

  public async changeStreamInfo(user: User, input: ChangeStreamInfoInput) {
    const { title, categoryId } = input;

    await this.prismaService.stream.update({
      where: {
        id: user.streamId,
      },
      data: {
        title,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    return true;
  }

  public async changeThumbnail(user: User, file: FileUpload) {
    const stream = await this.findByUserId(user);

    if (stream?.thumbnailUrl) {
      await this.storageService.remove(stream.thumbnailUrl);
    }

    const chunks: Buffer[] = [];

    for await (const chunk of file.createReadStream() as AsyncIterable<Buffer>) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    const fileName = `/streams/${user.username}.webp`;

    const processedBuffer = await sharp(buffer, {
      animated: file.filename.endsWith('.gif'),
    })
      .resize(1280, 720)
      .webp()
      .toBuffer();

    await this.storageService.upload(processedBuffer, fileName, 'image/webp');

    await this.prismaService.stream.update({
      where: {
        id: user.streamId,
      },
      data: {
        thumbnailUrl: fileName,
      },
    });

    return true;
  }

  public async removeThumbnail(user: User) {
    const stream = await this.findByUserId(user);

    if (stream?.thumbnailUrl) {
      await this.storageService.remove(stream.thumbnailUrl);
    }

    await this.prismaService.stream.update({
      where: {
        id: user.streamId,
      },
      data: {
        thumbnailUrl: null,
      },
    });

    return true;
  }

  public async generateToken(input: GenerateStreamTokenInput) {
    const { channelId, userId } = input;

    let self: { id: string; username: string };

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      self = { id: user.id, username: user.username };
    } else {
      self = {
        id: userId,
        username: `Зритель ${Math.floor(Math.random() * 100000)}`,
      };
    }

    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new NotFoundException('Канал не найден');
    }

    const token = new AccessToken(
      this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
      this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
      {
        identity: self.id,
        name: self.username,
      },
    );

    token.addGrant({
      room: channel.id,
      roomJoin: true,
      canPublish: false,
    });

    return { token: token.toJwt() };
  }

  private findBySearchTermFilter(searchTerm: string) {
    return {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          user: {
            username: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    };
  }

  private async findByUserId(user: User) {
    const stream = await this.prismaService.stream.findUnique({
      where: {
        id: user.streamId,
      },
    });

    return stream;
  }
}
