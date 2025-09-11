import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class MealOrderController {
  // GET all meal requests
  async getAll(req, res) {
    try {
      const meals = await prisma.mealRequest.findMany({
        include: {
          MempData: true,
          details: true,
        },
      });
      res.json({ success: true, data: meals });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch meal requests",
        error,
      });
    }
  }

  async getMealToday(req, res) {
    try {
      const { search, page = 1, date } = req.query;
      const limit = 10;
      const skip = (parseInt(page) - 1) * limit;

      // Normalisasi ke UTC midnight
      let startDate;
      let endDate;

      if (date) {
        const [year, month, day] = date.split("-").map(Number);

        // Gunakan Date.UTC supaya tidak geser ke timezone lokal
        startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        endDate = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0));
      } else {
        const today = new Date();
        startDate = new Date(
          Date.UTC(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0
          )
        );
        endDate = new Date(
          Date.UTC(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1,
            0,
            0,
            0
          )
        );
      }

      const whereClause = {
        AND: [
          search
            ? {
                OR: [
                  { pr_number: { contains: search, mode: "insensitive" } },
                  { name: { contains: search, mode: "insensitive" } },
                  { section: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          {
            details: {
              some: {
                date: {
                  gte: startDate,
                  lt: endDate,
                },
                is_selected: true,
              },
            },
          },
        ],
      };

      const total = await prisma.mealRequest.count({ where: whereClause });

      const meals = await prisma.mealRequest.findMany({
        where: whereClause,
        include: {
          details: {
            where: {
              date: {
                gte: startDate,
                lt: endDate,
              },
              is_selected: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { id: "asc" },
      });

      res.json({
        success: true,
        data: meals,
        paginate: {
          total,
          page: parseInt(page),
          last_page: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch meal requests",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      const meal = await prisma.mealRequest.findUnique({
        where: { id: parseInt(id) },
        include: {
          MempData: true,
          details: true,
        },
      });

      if (!meal)
        return res
          .status(404)
          .json({ success: false, message: "MealRequest not found" });

      res.json({ success: true, data: meal });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch meal request",
        error,
      });
    }
  }

  // CREATE a new meal request
  async create(req, res) {
    const { pr_number, name, section, shift, confirmation, details } = req.body;

    try {
      const meal = await prisma.mealRequest.create({
        data: {
          pr_number,
          name,
          section,
          shift,
          confirmation: confirmation || false,
          details: {
            create: details || [],
          },
        },
        include: {
          details: true,
          MempData: true,
        },
      });

      res.status(201).json({ success: true, data: meal });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to create meal request",
        error,
      });
    }
  }

  // UPDATE a meal request
  async update(req, res) {
    const { id } = req.params;
    const { name, section, shift, confirmation } = req.body;

    try {
      const meal = await prisma.mealRequest.update({
        where: { id: parseInt(id) },
        data: {
          name,
          section,
          shift,
          confirmation,
        },
      });

      res.json({ success: true, data: meal });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to update meal request",
        error,
      });
    }
  }

  // DELETE a meal request
  async delete(req, res) {
    const { id } = req.params;

    try {
      await prisma.mealRequest.delete({
        where: { id: parseInt(id) },
      });

      res.json({ success: true, message: "MealRequest deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to delete meal request",
        error,
      });
    }
  }
}

export default new MealOrderController();
