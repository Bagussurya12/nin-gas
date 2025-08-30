import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class GuestsController {
  async getAllGuest(req, res) {
    try {
      const { search = "", page = 1, limit = 10 } = req.query;

      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      const where = search
        ? {
            OR: [
              { fullname: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { idCard: { contains: search, mode: "insensitive" } },
              { company: { contains: search, mode: "insensitive" } },
              { visit_purpose: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

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
      const { fullname, id_card, email, phone, company, visit_purpose } =
        req.body;

      const guest = await prisma.guest.create({
        data: {
          fullname,
          id_card,
          email,
          phone,
          company,
          visit_purpose,
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
          fullname,
          idCard,
          email,
          phone,
          company,
          visit_purpose,
          visit_date,
          status,
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
