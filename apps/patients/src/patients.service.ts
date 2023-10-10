import { PrismaService } from '@lib/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get patient by user id
   * @param userId User id fetched from JWT
   * @returns Patient
   */

  // TODO: create proper DTOs for this
  async getPatientByUserId(userId: number) {
    return this.prisma.patient.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        lastTherapy: {
          include: {
            diagnosis: true,
            condition: true,
            taskTherapy: {
              include: {
                task: true,
              },
            },
          },
        },
        patientTherapies: {
          include: {
            therapy: {
              include: {
                diagnosis: true,
                condition: true,
                taskTherapy: {
                  include: {
                    task: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
