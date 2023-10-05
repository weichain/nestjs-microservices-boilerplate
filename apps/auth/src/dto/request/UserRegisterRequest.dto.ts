import { IsNotEmpty, IsString } from 'class-validator';
import { UserLoginRequestDto } from './UserLoginRequest.dto';

export class UserRegisterRequestDto extends UserLoginRequestDto {
  /**
   * Name of the user
   */
  @IsString()
  @IsNotEmpty()
  name: string;
}
