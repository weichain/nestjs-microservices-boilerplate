import { AuthMessagePatterns, TokenType, getCurrentTimestampInSeconds } from '@lib/common';
import { Config } from '@lib/config';
import { UserLoginResponseDto, UserUpdatePasswordResponseDto } from '@lib/dtos';
import { MainPrisma } from '@lib/prisma';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { ITestContext } from '../interfaces';
import { loginData } from './data';

export function shouldUpdatePassword(context: ITestContext) {
  describe('user update password', () => {
    const newPassword = 'new_password';
    it('should update password', async () => {
      const user = await context.prismaService.user.findFirst();

      const result = await firstValueFrom<UserUpdatePasswordResponseDto>(
        context.clientProxy.send(
          { cmd: AuthMessagePatterns.UPDATE_PASSWORD },
          { id: user.id, data: { oldPassword: loginData.password, newPassword } },
        ),
      );
      expect(result).toEqual({ email: loginData.email });
    });

    it('should fail if given wrong old password', async () => {
      const user = await context.prismaService.user.findFirst();
      await expect(
        firstValueFrom<UserUpdatePasswordResponseDto>(
          context.clientProxy.send(
            { cmd: AuthMessagePatterns.UPDATE_PASSWORD },
            { id: user.id, data: { oldPassword: loginData.password, newPassword } },
          ),
        ),
      ).rejects.toStrictEqual({
        message: 'Credentials not valid.',
        code: 11,
      });
    });

    it('should login after password reset', async () => {
      const jwtService = new JwtService({ secret: Config.JWT_SECRET });
      const result = await firstValueFrom<UserLoginResponseDto>(
        context.clientProxy.send({ cmd: AuthMessagePatterns.LOGIN }, { data: { ...loginData, password: newPassword } }),
      );

      const decoded = jwtService.decode(result.accessToken);

      const currentTimestamp = getCurrentTimestampInSeconds();

      expect(decoded['email']).toEqual(loginData.email);
      expect(decoded['type']).toEqual(TokenType.ACCESS_TOKEN);
      expect(decoded['role']).toEqual(MainPrisma.RoleType.USER);
      expect(decoded['iat']).toBeLessThanOrEqual(currentTimestamp);
      expect(decoded['exp']).toBeGreaterThan(currentTimestamp);
    });
  });
}
