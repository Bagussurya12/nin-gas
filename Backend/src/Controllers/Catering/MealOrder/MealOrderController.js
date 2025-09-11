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
      const { search } = req.query; // ambil query search dari URL
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const meals = await prisma.mealRequest.findMany({
        where: {
          AND: [
            // filter search jika ada
            search
              ? {
                  OR: [
                    { pr_number: { contains: search, mode: "insensitive" } },
                    { name: { contains: search, mode: "insensitive" } },
                    { section: { contains: search, mode: "insensitive" } },
                  ],
                }
              : {},
            // filter details yang ada tanggal hari ini
            {
              details: {
                some: {
                  date: {
                    gte: today,
                    lt: tomorrow,
                  },
                },
              },
            },
          ],
        },
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
        message: "Failed to fetch today's meal requests",
        error,
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
