import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { USER_JWT_STRATEGY } from './jwt.strategy';

@Injectable()
export default class JwtAuthGuard extends AuthGuard(USER_JWT_STRATEGY) {}
