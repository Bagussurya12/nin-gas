import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class GuestsController {
  async getAllGuest(req, res) {
    try {
      const {
        search = "",
        status,
        visit_purpose,
        startDate,
        endDate,
        page = 1,
        limit = 10,
      } = req.query;

      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      const where = {
        AND: [],
      };

      // filter search
      if (search) {
        where.AND.push({
          OR: [
            { fullname: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { id_card: { contains: search, mode: "insensitive" } },
            { company: { contains: search, mode: "insensitive" } },
          ],
        });
      }

      if (status) {
        where.AND.push({ status });
      }

      if (visit_purpose) {
        where.AND.push({ visit_purpose });
      }

      if (startDate && endDate) {
        where.AND.push({
          visit_date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        });
      } else if (startDate) {
        where.AND.push({
          visit_date: {
            gte: new Date(startDate),
          },
        });
      } else if (endDate) {
        where.AND.push({
          visit_date: {
            lte: new Date(endDate),
          },
        });
      }

      const total = await prisma.guest.count({ where });

      const guests = await prisma.guest.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { created_at: "desc" },
      });

      return res.json({
        success: true,
        message: "Daftar tamu berhasil diambil",
        data: guests,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil daftar tamu",
        error: error.message,
      });
    }
  }

  async createGuest(req, res) {
    try {
      const {
        fullname,
        id_card,
        email,
        phone,
        company,
        visit_purpose,
        visit_date,
        check_in,
        check_out,
        status,
      } = req.body;

      const guest = await prisma.guest.create({
        data: {
          fullname,
          id_card,
          email,
          phone,
          company,
          visit_purpose,
          visit_date: visit_date ? new Date(visit_date).toISOString() : null,
          check_in: check_in ? new Date(check_in).toISOString() : null,
          check_out: check_out ? new Date(check_out).toISOString() : null,
          status,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Tamu berhasil ditambahkan",
        data: guest,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Gagal menambahkan tamu",
        error: error.message,
      });
    }
  }

  // Get Guest by ID
  async getGuestById(req, res) {
    try {
      const { id } = req.params;

      const guest = await prisma.guest.findUnique({
        where: { id: Number(id) },
      });

      if (!guest) {
        return res.status(404).json({
          success: false,
          message: "Tamu tidak ditemukan",
        });
      }

      return res.json({
        success: true,
        message: "Detail tamu berhasil diambil",
        data: guest,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil detail tamu",
        error: error.message,
      });
    }
  }

  // Update Guest
  async updateGuest(req, res) {
    try {
      const { id } = req.params;
      const { fullname, idCard, email, phone, company, visit_purpose, status } =
        req.body;

      const guest = await prisma.guest.update({
        where: { id: Number(id) },
        data: {
          ...req.body,
          visit_date: req.body.visit_date
            ? new Date(req.body.visit_date)
            : null,
          check_in: req.body.check_in ? new Date(req.body.check_in) : null,
          check_out: req.body.check_out ? new Date(req.body.check_out) : null,
        },
      });

      return res.json({
        success: true,
        message: "Tamu berhasil diperbarui",
        data: guest,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Gagal memperbarui tamu",
        error: error.message,
      });
    }
  }

  // Delete Guest
  async deleteGuest(req, res) {
    try {
      const { id } = req.params;

      await prisma.guest.delete({
        where: { id: Number(id) },
      });

      return res.json({
        success: true,
        message: "Tamu berhasil dihapus",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus tamu",
        error: error.message,
      });
    }
  }
}

export default new GuestsController();
