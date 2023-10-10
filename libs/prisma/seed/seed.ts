import { faker } from '@faker-js/faker';
import { CurrentStatus, PrismaClient, ResourceType } from '../clients/main';

const prisma = new PrismaClient();
const currentStatusArray = Object.values(CurrentStatus);
const resourceTypeArray = Object.values(ResourceType);

async function seed() {
  const users = await createUsers(10);

  const diagnoses = await createDiagnoses(10);
  const symptoms = await createSymptoms(10);
  const conditions = await createConditions(symptoms, 10);
  const therapies = await createTherapies(diagnoses, conditions, 10);
  await createTasks(therapies, conditions, 10);

  await createDoctors(users.slice(0, 2), therapies);
  await createPatients(users.slice(2, 10), therapies);

  // Close Prisma client
  await prisma.$disconnect();
}

seed().catch((error) => {
  console.error('Error seeding data:', error);
});

async function createTherapies(diagnoses: any[], conditions: any[], count = 10) {
  const therapies = faker.helpers.multiple(
    () => {
      return {
        name: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        duration: faker.helpers.rangeToNumber({ min: 1, max: 30 }),
        status: faker.helpers.arrayElement(currentStatusArray),

        diagnosis: {
          connect: {
            id: diagnoses[faker.helpers.rangeToNumber({ min: 0, max: diagnoses.length - 1 })].id,
          },
        },
        condition: {
          connect: {
            id: conditions[faker.helpers.rangeToNumber({ min: 0, max: conditions.length - 1 })].id,
          },
        },
      };
    },
    { count },
  );

  const createdTherapies = [];
  for (const therapy of therapies) {
    const createdUser = await prisma.therapy.create({ data: { ...therapy } });
    console.log(`Created therapy with id ${createdUser.id}`);
    createdTherapies.push(createdUser);
  }

  return createdTherapies;
}

async function createSymptoms(count = 10) {
  const symptoms = faker.helpers.multiple(
    () => {
      return {
        name: faker.word.words(2),
        description: faker.lorem.sentence(),
      };
    },
    { count },
  );

  const createdSymptoms = [];
  for (const symptom of symptoms) {
    const createdUser = await prisma.symptom.create({ data: symptom });
    console.log(`Created symptom with id ${createdUser.id}`);
    createdSymptoms.push(createdUser);
  }

  return createdSymptoms;
}

async function createUsers(count = 10) {
  // Seed users
  const users = faker.helpers.multiple(
    () => {
      return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
    },
    { count },
  );

  const createdUsers = [];
  for (const user of users) {
    const createdUser = await prisma.user.create({ data: { ...user } });
    console.log(`Created user with id ${createdUser.id}`);
    createdUsers.push(createdUser);
  }

  return createdUsers;
}

async function createDiagnoses(count = 10) {
  const diagnoses = faker.helpers.multiple(
    () => {
      return {
        name: faker.word.words(2),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(currentStatusArray),
      };
    },
    { count },
  );

  const createdDiagnoses = [];
  for (const diagnosis of diagnoses) {
    const createdUser = await prisma.diagnosis.create({ data: { ...diagnosis } });
    console.log(`Created diagnosis with id ${createdUser.id}`);
    createdDiagnoses.push(createdUser);
  }

  return createdDiagnoses;
}

async function createConditions(symptoms: any[], count = 10) {
  function getRandomSymptoms() {
    return symptoms[faker.helpers.rangeToNumber({ min: 0, max: symptoms.length - 1 })];
  }

  const conditions = faker.helpers.multiple(
    () => {
      return {
        name: faker.word.words(2),
        description: faker.lorem.sentence(),
        severity: faker.word.adverb(),
        status: faker.helpers.arrayElement(currentStatusArray),
      };
    },
    { count },
  );

  const createdConditions = [];
  for (const condition of conditions) {
    const createdUser = await prisma.condition.create({
      data: {
        ...condition,
        conditionSymptom: {
          create: {
            symptom: {
              connect: {
                id: getRandomSymptoms().id,
              },
            },
          },
        },
      },
    });
    console.log(`Created condition with id ${createdUser.id}`);
    createdConditions.push(createdUser);
  }

  return createdConditions;
}

async function createDoctors(users: any[], therapies: any[]) {
  const doctors = [];
  let therapyId = null;
  for (let i = 0; i < users.length; i++) {
    therapyId = therapies[faker.helpers.rangeToNumber({ min: 0, max: therapies.length - 1 })].id;
    doctors.push({
      specialty: faker.helpers.arrayElement(['Cardiology', 'Orthopedics', 'Neurology']),
      user: {
        connect: {
          id: users[i].id,
        },
      },
    });
  }

  const createdDoctors = [];
  for (const doctor of doctors) {
    const createdUser = await prisma.doctor.create({
      data: {
        ...doctor,
        doctorTherapies: {
          create: {
            therapy: {
              connect: {
                id: therapyId,
              },
            },
          },
        },
      },
    });
    console.log(`Created doctor with id ${createdUser.id}`);
    createdDoctors.push(createdUser);
  }

  return createdDoctors;
}

async function createPatients(users: any[], therapies: any[]) {
  const patients = [];
  let therapyId = null;
  for (let i = 0; i < users.length; i++) {
    therapyId = therapies[faker.helpers.rangeToNumber({ min: 0, max: therapies.length - 1 })].id;
    patients.push({
      user: {
        connect: {
          id: users[i].id,
        },
      },
      lastTherapy: {
        connect: {
          id: therapyId,
        },
      },
    });
  }

  const createdPatients = [];
  for (const patient of patients) {
    const createdUser = await prisma.patient.create({
      data: {
        ...patient,
        patientTherapies: {
          create: {
            therapy: {
              connect: {
                id: therapyId,
              },
            },
          },
        },
      },
    });
    console.log(`Created patient with id ${createdUser.id}`);
    createdPatients.push(createdUser);
  }

  return createdPatients;
}

async function createTasks(therapies: any[], conditions: any[], count = 10) {
  for (let i = 0; i < count; i++) {
    const createdTask = await prisma.task.create({
      data: {
        description: faker.lorem.sentence(),
        output: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(currentStatusArray),
        taskTherapy: {
          create: {
            therapy: {
              connect: {
                id: therapies[faker.helpers.rangeToNumber({ min: 0, max: therapies.length - 1 })].id,
              },
            },
          },
        },
        taskCondition: {
          create: {
            condition: {
              connect: {
                id: conditions[faker.helpers.rangeToNumber({ min: 0, max: conditions.length - 1 })].id,
              },
            },
          },
        },
        taskResource: {
          create: {
            resource: {
              create: {
                name: faker.lorem.sentence(),
                type: faker.helpers.arrayElement(resourceTypeArray),
              },
            },
          },
        },
      },
    });
    console.log(`Created task with id ${createdTask.id}`);
  }
}
