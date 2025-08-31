import { PrismaClient } from "@prisma/client";
import { format } from "@fast-csv/format";
import { PassThrough } from "stream";

const prisma = new PrismaClient();

class ExportGuestService {
  async getAllGuests(filters) {
    const where = {};

    if (filters.search) {
      where.OR = [
        { fullname: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { company: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.visit_purpose) {
      where.visit_purpose = filters.visit_purpose;
    }

    if (filters.startDate && filters.endDate) {
      where.visit_date = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    return await prisma.guest.findMany({
      where,
      orderBy: { id: "asc" },
    });
  }

  async exportGuestsToCSVStream(filters) {
    const guests = await this.getAllGuests(filters);

    if (!guests || guests.length === 0) {
      throw new Error("Tidak ada data tamu untuk diexport");
    }

    const dateFormatter = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const statusMap = {
      expected: "Dijadwalkan",
      checked_in: "Check-in",
      checked_out: "Check-out",
      cancelled: "Dibatalkan",
    };

    const csvStream = format({
      headers: [
        "Nama Lengkap",
        "Nomor Identitas",
        "Email",
        "Nomor Handphone",
        "Nama Perusahaan",
        "Tujuan",
        "Tanggal Kunjungan",
        "Check In",
        "Check Out",
        "Status",
      ],
    });

    const passthrough = new PassThrough();

    guests.forEach((guest) => {
      csvStream.write({
        "Nama Lengkap": guest.fullname,
        "Nomor Identitas": guest.id_card,
        Email: guest.email || "-",
        "Nomor Handphone": guest.phone || "-",
        "Nama Perusahaan": guest.company || "-",
        Tujuan: guest.visit_purpose || "-",
        "Tanggal Kunjungan": guest.visit_date
          ? dateFormatter.format(new Date(guest.visit_date))
          : "-",
        "Check In": guest.check_in
          ? dateTimeFormatter.format(new Date(guest.check_in))
          : "-",
        "Check Out": guest.check_out
          ? dateTimeFormatter.format(new Date(guest.check_out))
          : "-",
        Status: statusMap[guest.status] || guest.status || "-",
      });
    });

    csvStream.end();
    return csvStream.pipe(passthrough);
  }
}

export default new ExportGuestService();
