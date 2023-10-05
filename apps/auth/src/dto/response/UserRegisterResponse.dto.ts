import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRegisterResponseDto {
  /**
   * The email of the user
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
