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
              create: Array.from({ length: 5 }, (_, idx) => ({
                emp_pr_number: emp.strprno,
                date: date,
                is_selected: getRandomBoolean(),
                is_taken: false,
                menu_id: idx + 1, // menu_id dari 1 sampai 5
              })),
            },
          },
        });

        console.log(
          `MealRequest created for ${emp.strprno} on ${date.toDateString()}`
        );
      }
    }

    console.log("✅ Seeding MealRequest with menu_id 1-5 finished!");
  } catch (error) {
    console.error("Seeder error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMealRequests();
