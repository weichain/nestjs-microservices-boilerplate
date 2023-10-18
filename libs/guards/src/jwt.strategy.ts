import { Config } from '@lib/config';
import { PrismaService } from '@lib/prisma';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export const USER_JWT_STRATEGY = 'user-jwt-strategy';

interface IAuthPayload {
  email: string;
}

interface IAuthResponse {
  id: string;
}

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, USER_JWT_STRATEGY) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.JWT_SECRET,
    });
  }

  async validate(payload: IAuthPayload): Promise<IAuthResponse> {
    const user = await this.prisma.user.findFirst({
      select: {
        id: true,
      },
      where: {
        email: payload.email,
      },
    });

    // Validate that the user has not revoked the token.
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
