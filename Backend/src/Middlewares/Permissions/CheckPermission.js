import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function checkPermission(permissionName) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId)
        return res.status(401).json({ error: true, message: "Unauthorized" });

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

      const userPermissions = new Set();

      // Permission langsung dari user
      user.permissions.forEach((up) => userPermissions.add(up.permission.name));

      // Permission dari role
      user.roles.forEach((ur) => {
        ur.role.permissions.forEach((rp) =>
          userPermissions.add(rp.permission.name)
        );
      });

      if (!userPermissions.has(permissionName)) {
        return res.status(403).json({
          error: true,
          message: "You do not have permission to access this resource",
        });
      }
      console.log("req.body di checkPermission:", req.body);
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  };
}
