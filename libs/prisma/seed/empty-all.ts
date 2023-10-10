import { PrismaClient } from '../clients/main';

const prisma = new PrismaClient();
async function deleteAllRows() {
  try {
    await prisma.patientTherapies.deleteMany({});
    await prisma.doctorTherapies.deleteMany({});
    await prisma.taskCondition.deleteMany({});
    await prisma.taskResource.deleteMany({});
    await prisma.taskTherapy.deleteMany({});
    await prisma.conditionSymptom.deleteMany({});
    await prisma.userResource.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.therapy.deleteMany({});
    await prisma.diagnosis.deleteMany({});
    await prisma.symptom.deleteMany({});
    await prisma.condition.deleteMany({});
    await prisma.resource.deleteMany({});
    await prisma.consumer.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.patient.deleteMany({});
    console.log('All rows deleted successfully.');
  } catch (error) {
    console.error('Error deleting rows:', error);
  } finally {
    // Close Prisma client
    await prisma.$disconnect();
  }
}

deleteAllRows();
