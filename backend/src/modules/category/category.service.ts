import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CategoryService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findAll() {
    const categories = await this.prismaService.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return categories;
  }

  public async findRandom() {
    const categories = await this.prismaService.category.findMany();

    return categories.sort(() => Math.random() - 0.5).slice(0, 7);
  }

  public async findBySlug(slug: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        slug,
      },
      include: {
        streams: {
          include: {
            user: true,
            category: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }
}
