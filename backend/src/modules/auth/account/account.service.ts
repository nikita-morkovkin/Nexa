import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';

@Injectable()
export class AccountService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findAll() {
    return await this.prismaService.user.findMany();
  }

  public async create(input: CreateUserInput) {
    const { username, email, password } = input;

    const isUsernameExist = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (isUsernameExist) {
      throw new ConflictException('Такое имя пользователя уже занято');
    }

    const isEmailExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      throw new ConflictException('Такая почта уже занята');
    }

    const hashedPassword = await hash(password);

    await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        displayName: username,
      },
    });

    return true;
  }
}
