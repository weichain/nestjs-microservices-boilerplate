import { IsString } from 'class-validator';

export class UserLoginResponseDto {
  @IsString()
  accessToken: string;

  constructor(data: { accessToken: string }) {
    this.accessToken = data.accessToken;
  }
}
