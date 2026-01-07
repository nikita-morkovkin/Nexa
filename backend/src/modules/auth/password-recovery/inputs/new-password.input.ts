import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { Match } from 'src/shared/decorators/match.decorator';

@InputType()
export class NewPasswordInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Пароль должен содержать не менее 8 символов.' })
  public newPassword: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Match('newPassword', { message: 'Пароли не совпадают' })
  public confirmPassword: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'Неверный токен' })
  public token: string;
}
