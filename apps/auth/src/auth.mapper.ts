import { MainPrisma } from '@lib/prisma';

export class UserRegisterMapper {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public entityToDto(entity: MainPrisma.User) {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dtoToEntity(__dto: any): MainPrisma.User {
    throw new Error('Method not implemented.');
  }
}