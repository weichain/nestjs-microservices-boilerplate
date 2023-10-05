import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserLoginRequestDto {
  /**
   * The email of the user
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The password of the user
   */
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}
