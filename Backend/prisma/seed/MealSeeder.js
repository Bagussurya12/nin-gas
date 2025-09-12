import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function getRandomBoolean() {
  return Math.random() < 0.5;
}

async function seedMealRequests() {
  try {
    const employees = await prisma.mempData.findMany();

    for (const emp of employees) {
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        await prisma.mealRequest.create({
          data: {
            pr_number: emp.strprno,
            name: emp.strname || "Unknown",
            section: emp.strsectdesc || null,
            shift: emp.strshift || null,
            confirmation: false,
            details: {
              create: [
                {
                  emp_pr_number: emp.strprno,
                  date: date,
                  is_selected: getRandomBoolean(),
                  is_taken: false,
                },
              ],
            },
          },
        });

        console.log(
          `MealRequest created for ${emp.strprno} on ${date.toDateString()}`
        );
      }
    }

    console.log("Seeding MealRequest for 2 days finished!");
  } catch (error) {
    console.error("Seeder error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMealRequests();
