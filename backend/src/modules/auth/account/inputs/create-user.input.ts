import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, {
    description:
      'Уникальное имя пользователя. Должно содержать только буквы и цифры, а также один дефис (не в начале и не в конце). Пример: ivan-ivanov123',
  })
  @IsNotEmpty({
    message: 'Имя пользователя обязательно и не может быть пустым.',
    context: {
      description: 'Гарантирует, что поле имени пользователя не пустое.',
    },
  })
  @IsString({
    message: 'Имя пользователя должно быть строкой.',
    context: {
      description: 'Гарантирует, что имя пользователя является строкой.',
    },
  })
  @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)?$/, {
    message:
      'Имя пользователя должно начинаться и заканчиваться буквой или цифрой, может содержать один дефис (не в начале и не в конце), например: username, username-user, username0, username-user0.',
    context: {
      description:
        'Имя пользователя должно содержать только буквы, цифры и не более одного дефиса (не в начале и не в конце).',
    },
  })
  public username: string;

  @Field(() => String, {
    description:
      'Электронная почта пользователя. Должна быть в правильном формате. Пример: user@example.com',
  })
  @IsEmail(
    {},
    {
      message: 'Электронная почта должна быть действующим email адресом.',
      context: {
        description:
          'Гарантирует, что значение соответствует формату email адреса.',
      },
    },
  )
  @IsNotEmpty({
    message: 'Электронная почта обязательна и не может быть пустой.',
    context: { description: 'Гарантирует, что поле email не пустое.' },
  })
  @IsString({
    message: 'Электронная почта должна быть строкой.',
    context: { description: 'Гарантирует, что email передан как строка.' },
  })
  public email: string;

  @Field(() => String, {
    description: 'Пароль для аккаунта. Должен быть не менее 8 символов.',
  })
  @IsNotEmpty({
    message: 'Пароль обязателен и не может быть пустым.',
    context: { description: 'Гарантирует, что поле пароля не пустое.' },
  })
  @IsString({
    message: 'Пароль должен быть строкой.',
    context: { description: 'Гарантирует, что пароль передан как строка.' },
  })
  @MinLength(8, {
    message: 'Пароль должен содержать не менее 8 символов.',
    context: {
      description: 'Гарантирует, что пароль содержит минимум 8 символов.',
    },
  })
  public password: string;
}
