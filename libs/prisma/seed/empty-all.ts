import { PrismaClient } from '../clients/main';

const prisma = new PrismaClient();
async function deleteAllRows() {
  try {
    // Delete all rows from the PatientTherapies table
    await prisma.patientTherapies.deleteMany({});

    // Delete all rows from the DoctorTherapies table
    await prisma.doctorTherapies.deleteMany({});

    // Delete all rows from the Task table
    await prisma.task.deleteMany({});

    // Delete all rows from the Therapy table
    await prisma.therapy.deleteMany({});

    // Delete all rows from the Diagnosis table
    await prisma.diagnosis.deleteMany({});

    // Delete all rows from the Condition table
    await prisma.condition.deleteMany({});

    // Delete all rows from the Symptom table
    await prisma.symptom.deleteMany({});

    // Delete all rows from the Resource table
    await prisma.resource.deleteMany({});

    // Delete all rows from the Consumer table
    await prisma.consumer.deleteMany({});

    // Delete all rows from the User table
    await prisma.user.deleteMany({});

    // Delete all rows from the Doctor table
    await prisma.doctor.deleteMany({});

    console.log('All rows deleted successfully.');
  } catch (error) {
    console.error('Error deleting rows:', error);
  } finally {
    // Close Prisma client
    await prisma.$disconnect();
  }
}

deleteAllRows();
