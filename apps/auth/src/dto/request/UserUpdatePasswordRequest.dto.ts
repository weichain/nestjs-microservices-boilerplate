import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserUpdatePasswordRequestDto {
  /**
   * The user's old password
   */
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  /**
   * The user's new password
   */
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
