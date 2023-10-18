import { AuthMessagePatterns } from '@lib/common';
import { firstValueFrom } from 'rxjs';
import { ITestContext } from '../interfaces';
import { registrationData } from './data';

export function shouldRegister(context: ITestContext) {
  describe('user registration', () => {
    it('should register', async () => {
      const result = await firstValueFrom(context.clientProxy.send({ cmd: AuthMessagePatterns.REGISTER }, { data: registrationData }));
      expect(result).toEqual({ email: registrationData.email });
    });

    it('should fail if email exists', async () => {
      await expect(
        firstValueFrom(context.clientProxy.send({ cmd: AuthMessagePatterns.REGISTER }, { data: registrationData })),
      ).rejects.toStrictEqual({
        message: 'User creation failed.',
        code: 11,
      });
    });
  });
}
