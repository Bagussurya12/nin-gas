import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding Guests...");

  const guestsData = Array.from({ length: 20 }).map(() => ({
    fullname: faker.person.fullName(),
    id_card: faker.string.alphanumeric(12),
    email: faker.internet.email(),
    phone: faker.phone.number("+62###########"),
    company: faker.company.name(),
    visit_purpose: faker.helpers.arrayElement([
      "Meeting",
      "Interview",
      "Business Visit",
      "Maintenance",
      "Delivery",
      "Psikotest",
      "Vendor",
      "Lain-lain",
    ]),
    visit_date: faker.date.between({
      from: "2025-09-11T00:00:00.000Z",
      to: "2025-09-12T23:59:59.999Z",
    }),
    status: faker.helpers.arrayElement([
      "expected",
      "checked_in",
      "checked_out",
      "cancelled",
    ]),
    check_in: faker.helpers.maybe(() => faker.date.recent({ days: 5 }), {
      probability: 0.6,
    }),
    check_out: faker.helpers.maybe(() => faker.date.recent({ days: 3 }), {
      probability: 0.4,
    }),
  }));

  await prisma.guest.createMany({
    data: guestsData,
  });

  console.log("Seeding Guests finished!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
