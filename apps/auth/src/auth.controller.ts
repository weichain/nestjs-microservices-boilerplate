import { AuthMessagePatterns } from '@lib/common';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  UserLoginRequestDto,
  UserLoginResponseDto,
  UserRegisterRequestDto,
  UserRegisterResponseDto,
  UserUpdatePasswordRequestDto,
  UserUpdatePasswordResponseDto,
} from './dto';

/**
 * The Auth Controller is responsible for handling all
 * incoming requests related to authentication and authorization.
 */
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user in the database
   * @param input The data to create the user
   * @returns {Promise<UserRegisterResponseDto>} The new user
   */
  @MessagePattern({ cmd: AuthMessagePatterns.REGISTER })
  public register(input: { data: UserRegisterRequestDto }): Promise<UserRegisterResponseDto> {
    return this.authService.register(input.data);
  }

  /**
   * Logs in a user with the provided login details and generates a JSON Web Token (JWT).
   * @param input The data containing user login details.
   * @returns {Promise<UserLoginResponseDto>} A Promise that resolves to the user login response DTO.
   */
  @MessagePattern({ cmd: AuthMessagePatterns.LOGIN })
  public login(input: { data: UserLoginRequestDto }): Promise<UserLoginResponseDto> {
    return this.authService.login(input.data);
  }

  /**
   * Updates the password of a user.
   * @param input The data containing user login details.
   * @returns {Promise<UserUpdatePasswordResponseDto>} A Promise that resolves to the user update password response DTO.
   */
  @MessagePattern({ cmd: AuthMessagePatterns.UPDATE_PASSWORD })
  public updatePassword(input: { id: string; data: UserUpdatePasswordRequestDto }): Promise<UserUpdatePasswordResponseDto> {
    return this.authService.updatePassword(input.id, input.data);
  }
}
