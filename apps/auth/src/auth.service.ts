import { TokenType } from '@lib/common';
import { PrismaService } from '@lib/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import {
  UserLoginRequestDto,
  UserLoginResponseDto,
  UserRegisterRequestDto,
  UserRegisterResponseDto,
  UserUpdatePasswordRequestDto,
  UserUpdatePasswordResponseDto,
} from './dto';
import { InvalidCredentials, UserCreationFailure, UserUpdateFailure } from './errors';

/**
 * The Auth Service is responsible for handling all authentication and authorization related operations.
 * It is used by the Auth Controller to handle incoming requests.
 */
@Injectable()
export class AuthService {
  protected logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user in the database
   * @param {UserRegisterRequestDto} data The data to create the user
   * @throws {UserCreationFailure} If the user cannot be created
   * @returns {Promise<UserRegisterResponseDto>} The new user
   */
  public async register(data: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    const { email, password, name } = data;

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: await hash(password),
          name,
        },
      });
      return new UserRegisterResponseDto(user.email);
    } catch (error) {
      throw new UserCreationFailure();
    }
  }

  /**
   * Logs in a user with the provided login details and generates a JSON Web Token (JWT).
   * The JWT is signed with the user's email and the JWT secret.
   * The JWT is valid for 24 hours.
   *
   * @param {UserLoginRequestDto} data - The data containing user login details.
   * @returns {Promise<UserLoginResponseDto>} A Promise that resolves to the user login response DTO.
   * @throws {InvalidCredentials} If the provided credentials are invalid.
   * @throws {UserNotFound} If no user is found with the provided email.
   *
   */
  public async login(data: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    const user = await this.prisma.user.findFirst({ where: { email: data.email } });

    if (!user) {
      throw new InvalidCredentials();
    }

    const validPassword = await verify(user.password, data.password);

    if (!validPassword) {
      throw new InvalidCredentials();
    }

    return new UserLoginResponseDto({
      accessToken: await this.jwtService.signAsync({
        email: user.email,
        type: TokenType.ACCESS_TOKEN,
        role: user.role,
      }),
    });
  }

  /**
   * Update the password of the user with the given ID.
   *
   * @param userId The ID of the user to update.
   * @param {UserUpdatePasswordRequest} data The data to update the user with.
   * @returns {Promise<UserResetPasswordResponse>} The updated user.
   * @throws {UserUpdateFailure} If the user cannot be updated.
   */
  public async updatePassword(userId: string, data: UserUpdatePasswordRequestDto): Promise<UserUpdatePasswordResponseDto> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });

    const validPassword = await verify(user.password, data.oldPassword);
    if (!validPassword) {
      throw new InvalidCredentials();
    }

    try {
      const hashedNewPassword = await hash(data.newPassword);

      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      return new UserUpdatePasswordResponseDto(user.email);
    } catch (error) {
      throw new UserUpdateFailure();
    }
  }
}
