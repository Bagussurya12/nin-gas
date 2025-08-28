import prisma from "../../../prisma.js";

/**
 * Cek apakah user memiliki permission tertentu
 * @param {number} userId
 * @param {string} permissionName
 * @returns {Promise<boolean>}
 */
export async function hasPermission(userId, permissionName) {
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      permissions: { include: { permission: true } },
      roles: {
        include: {
          role: {
            include: { permissions: { include: { permission: true } } },
          },
        },
      },
    },
  });

  if (!user) return false;

  const userPermissions = new Set();

  // Permission langsung dari user
  user.permissions.forEach((up) => userPermissions.add(up.permission.name));

  // Permission dari role
  user.roles.forEach((ur) => {
    ur.role.permissions.forEach((rp) =>
      userPermissions.add(rp.permission.name)
    );
  });

  return userPermissions.has(permissionName);
}
