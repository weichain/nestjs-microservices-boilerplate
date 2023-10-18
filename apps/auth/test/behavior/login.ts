import { AuthMessagePatterns, TokenType, getCurrentTimestampInSeconds } from '@lib/common';
import { Config } from '@lib/config';
import { UserLoginResponseDto } from '@lib/dtos';
import { MainPrisma } from '@lib/prisma';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { ITestContext } from '../interfaces';
import { loginData } from './data';

export function shouldLogin(context: ITestContext) {
  describe('user login', () => {
    it('should login', async () => {
      const jwtService = new JwtService({ secret: Config.JWT_SECRET });
      const result = await firstValueFrom<UserLoginResponseDto>(
        context.clientProxy.send({ cmd: AuthMessagePatterns.LOGIN }, { data: loginData }),
      );

      const decoded = jwtService.decode(result.accessToken);

      const currentTimestamp = getCurrentTimestampInSeconds();

      expect(decoded['email']).toEqual(loginData.email);
      expect(decoded['type']).toEqual(TokenType.ACCESS_TOKEN);
      expect(decoded['role']).toEqual(MainPrisma.RoleType.USER);
      expect(decoded['iat']).toBeLessThanOrEqual(currentTimestamp);
      expect(decoded['exp']).toBeGreaterThan(currentTimestamp);
    });

    it('should fail given wrong password', async () => {
      await expect(
        firstValueFrom<UserLoginResponseDto>(
          context.clientProxy.send({ cmd: AuthMessagePatterns.LOGIN }, { data: { ...loginData, password: 'wrong_pass' } }),
        ),
      ).rejects.toStrictEqual({
        message: 'Credentials not valid.',
        code: 11,
      });
    });
  });
}
