import { AuditLogLevelOption } from '@lib/decorators';
import { MainPrisma, PrismaService } from '@lib/prisma';
import { Injectable } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class AuditLoggerService {
  constructor(private readonly prisma: PrismaService) {}

  async createHttpAudit(level: AuditLogLevelOption, request: ExpressRequest, userId: string) {
    const { method, url, body } = request;
    const data = level === 'no-data' ? null : body;

    await this.prisma.auditLog.create({
      data: {
        userId: userId,
        context: 'http',
        method: this.httpMethodToRequestMethodEnum(method),
        event: url,
        data,
      },
    });
  }

  private httpMethodToRequestMethodEnum(method: string): MainPrisma.AuditLogRequestMethodEnum | null {
    switch (method) {
      case 'GET':
        return 'get';
      case 'POST':
        return 'post';
      case 'PUT':
        return 'put';
      case 'PATCH':
        return 'patch';
      case 'DELETE':
        return 'delete';
      default:
        return null;
    }
  }
}
