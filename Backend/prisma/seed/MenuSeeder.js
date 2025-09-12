import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding menu...");

  const menus = [
    {
      name: "Nasi Goreng Spesial",
      description: "Nasi goreng dengan ayam, telur, dan sayuran.",
      category: "Main Course",
      price: 25000,
      nutrition: {
        create: {
          calories: 550,
          protein: 20.5,
          carbs: 60.0,
          fat: 18.5,
          sugar: 5.2,
          fiber: 3.1,
          sodium: 800,
        },
      },
      images: {
        create: [
          {
            url: "https://example.com/images/nasi-goreng-1.jpg",
            is_primary: true,
          },
          {
            url: "https://example.com/images/nasi-goreng-2.jpg",
            is_primary: false,
          },
        ],
      },
    },
    {
      name: "Soto Ayam",
      description: "Soto ayam dengan kuah bening segar.",
      category: "Soup",
      price: 20000,
      nutrition: {
        create: {
          calories: 350,
          protein: 15.0,
          carbs: 25.0,
          fat: 10.0,
          sugar: 2.0,
          fiber: 1.5,
          sodium: 700,
        },
      },
      images: {
        create: [
          { url: "https://example.com/images/soto-ayam.jpg", is_primary: true },
        ],
      },
    },
    {
      name: "Ayam Bakar",
      description: "Ayam bakar bumbu kecap manis.",
      category: "Main Course",
      price: 30000,
      nutrition: {
        create: {
          calories: 450,
          protein: 35.0,
          carbs: 15.0,
          fat: 20.0,
          sugar: 5.0,
          fiber: 2.0,
          sodium: 600,
        },
      },
      images: {
        create: [
          {
            url: "https://example.com/images/ayam-bakar.jpg",
            is_primary: true,
          },
        ],
      },
    },
    {
      name: "Gado-Gado",
      description: "Sayuran rebus dengan bumbu kacang.",
      category: "Salad",
      price: 18000,
      nutrition: {
        create: {
          calories: 400,
          protein: 12.0,
          carbs: 40.0,
          fat: 15.0,
          sugar: 8.0,
          fiber: 5.0,
          sodium: 500,
        },
      },
      images: {
        create: [
          { url: "https://example.com/images/gado-gado.jpg", is_primary: true },
        ],
      },
    },
    {
      name: "Ikan Goreng",
      description: "Ikan Gurame Goreng.",
      category: "Main Course",
      price: 8000,
      nutrition: {
        create: {
          calories: 120,
          protein: 230,
          carbs: 30.0,
          fat: 0,
          sugar: 28.0,
          fiber: 0,
          sodium: 10,
        },
      },
      images: {
        create: [
          {
            url: "https://example.com/images/ikan-goreng.jpg",
            is_primary: true,
          },
        ],
      },
    },
  ];

  for (const menu of menus) {
    await prisma.menu.create({ data: menu });
  }

  console.log("✅ 5 Menu seeding selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
