import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class MempController {
  async getEmployee(req, res) {
    try {
      const { search, page = 1, limit = 10 } = req.query;
      const take = parseInt(limit);
      const skip = (parseInt(page) - 1) * take;

      const whereClause = search
        ? {
            OR: [
              { strprno: { contains: search, mode: "insensitive" } },
              { strname: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      const total = await prisma.mempData.count({ where: whereClause });

      const data = await prisma.mempData.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { strprno: "asc" },
      });

      return res.json({
        success: true,
        data,
        paginate: {
          total,
          page: parseInt(page),
          last_page: Math.ceil(total / take),
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch MempData",
        error: error.message,
      });
    }
  }
}

export default new MempController();
