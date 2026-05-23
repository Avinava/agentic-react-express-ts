import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Priority, TaskStatus } from '@prisma/client';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  console.log('Seeding database...');

  await prisma.projectMember.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.contact.deleteMany();

  const [john, jane, alex] = await Promise.all([
    prisma.contact.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0101',
        company: 'Tech Corp',
        notes: 'Lead developer, 5+ yrs experience.',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0102',
        company: 'Design Studio',
        notes: 'UI/UX designer.',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Alex',
        lastName: 'Chen',
        email: 'alex.chen@example.com',
        company: 'Cloud Systems',
        notes: 'DevOps & infrastructure.',
      },
    }),
  ]);

  const website = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of the marketing site.',
      status: 'active',
      members: {
        create: [
          { contactId: jane.id, role: 'lead' },
          { contactId: john.id, role: 'member' },
        ],
      },
    },
  });

  const platform = await prisma.project.create({
    data: {
      name: 'Internal Platform',
      description: 'New developer platform with self-serve tooling.',
      status: 'active',
      members: {
        create: [
          { contactId: alex.id, role: 'lead' },
          { contactId: john.id, role: 'member' },
        ],
      },
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Wireframe homepage',
        description: 'Draft three concepts for review.',
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        assigneeId: jane.id,
        projectId: website.id,
      },
      {
        title: 'Implement React 19 upgrade',
        description: 'Update to React 19 and address any deprecations.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.MEDIUM,
        assigneeId: john.id,
        projectId: website.id,
      },
      {
        title: 'Set up Kubernetes cluster',
        description: 'Production-ready cluster on AWS.',
        status: TaskStatus.TODO,
        priority: Priority.URGENT,
        assigneeId: alex.id,
        projectId: platform.id,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
      {
        title: 'Draft API contract',
        description: 'OpenAPI spec for first internal service.',
        status: TaskStatus.REVIEW,
        priority: Priority.HIGH,
        assigneeId: alex.id,
        projectId: platform.id,
      },
    ],
  });

  console.log('Seed complete.');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
