import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const plainPassword = "password";

// jumlah salt rounds (standar 10)
const saltRounds = 10;

async function main() {
  // =========================
  // 🔹 Seed Permissions
  // =========================
  const permissionsList = [
    "Settings - User - Can List User Management",
    "Settings - User - Can Create User Management",
    "Settings - User - Can Show User Management",
    "Settings - User - Can Update User Management",
    "Settings - User - Can Delete User Management",
    // Master Data
    "Catering - Can List Catering Management",
    "Catering - Can Create Catering Management",
    "Catering - Can Show Catering Management",
    "Catering - Can Update Catering Management",
    "Catering - Can Delete Catering Management",
    // Guest List Data
    "Guests - Can List Guests Management",
    "Guests - Can Create Guests Management",
    "Guests - Can Show Guests Management",
    "Guests - Can Update Guests Management",
    "Guests - Can Delete Guests Management",
  ];

  const permissionRecords = [];

  for (const name of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    permissionRecords.push(perm);
  }

  console.log("✅ Permissions seeded");

  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  console.log("✅ Role 'admin' seeded");
  for (const perm of permissionRecords) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id },
      },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  console.log("✅ Role ↔ Permissions linked");

  // =========================
  // 🔹 Seed User
  // =========================
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  // seed user admin
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  console.log("✅ User 'admin' seeded");

  // =========================
  // 🔹 Hubungkan user ↔ role
  // =========================
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log("✅ User ↔ Role linked");

  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
