import { faker } from '@faker-js/faker';
import { UserLoginRequestDto, UserRegisterRequestDto } from '@lib/dtos';

export const registrationData: UserRegisterRequestDto = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: 'Test',
};

export const loginData: UserLoginRequestDto = {
  email: registrationData.email,
  password: registrationData.password,
};
