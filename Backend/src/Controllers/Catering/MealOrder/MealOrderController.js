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
      const { search, page = 1, limit = 10, date } = req.query;
      const parsedPage = parseInt(page) || 1;
      const parsedLimit = parseInt(limit) || 10;
      const skip = (parsedPage - 1) * parsedLimit;

      const [year, month, day] = (
        date || new Date().toISOString().split("T")[0]
      )
        .split("-")
        .map(Number);

      const queryDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

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
                date: queryDate,
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
              date: queryDate,
              is_selected: true,
            },
          },
        },
        skip,
        take: parsedLimit,
        orderBy: { id: "asc" },
      });

      res.json({
        success: true,
        data: meals,
        paginate: {
          total,
          page: parsedPage,
          last_page: Math.ceil(total / parsedLimit),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil daftar meal requests",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    const { detailId } = req.query;

    try {
      const meal = await prisma.mealRequest.findUnique({
        where: { id: parseInt(id) },
        include: {
          details: detailId
            ? {
                where: { id: parseInt(detailId) },
              }
            : true,
        },
      });

      if (!meal) {
        return res
          .status(404)
          .json({ success: false, message: "MealRequest not found" });
      }

      res.json({ success: true, data: meal });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch meal request",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      let { pr_number, name, section, shift, confirmation, details } = req.body;
      details =
        details?.map((d) => ({
          ...d,
          date: new Date(d.date),
        })) || [];

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
        },
      });

      return res.status(201).json({
        success: true,
        message: "Meal Req berhasil ditambahkan",
        data: meal,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create meal request",
        error: error.message,
      });
    }
  }

  // UPDATE a meal request
  async update(req, res) {
    const { id } = req.params;
    const { name, section, shift, confirmation, details } = req.body;

    try {
      const meal = await prisma.mealRequest.update({
        where: { id: parseInt(id) },
        data: {
          name,
          section,
          shift,
          confirmation,
          details: {
            upsert: details?.map((d) => ({
              where: { id: d.id || 0 },
              update: {
                emp_pr_number: d.emp_pr_number,
                date: new Date(d.date),
                is_taken: d.is_taken,
                is_selected: d.is_selected,
              },
              create: {
                emp_pr_number: d.emp_pr_number,
                date: new Date(d.date),
                is_taken: d.is_taken,
                is_selected: d.is_selected,
              },
            })),
          },
        },
        include: {
          details: true,
        },
      });

      res.json({ success: true, data: meal });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to update meal request",
        error: error.message,
      });
    }
  }

  async updateMealTake(req, res) {
    try {
      const { id } = req.params;

      const updatedDetail = await prisma.mealRequestDetail.update({
        where: { id: Number(id) },
        data: {
          is_taken: true,
          taken_at: new Date(),
        },
      });
      res.json({
        success: true,
        message: "Meal request detail updated successfully",
        data: updatedDetail,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update meal request detail",
        error: error.message,
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
