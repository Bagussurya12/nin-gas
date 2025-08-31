import { PrismaClient } from "@prisma/client";
import { format } from "@fast-csv/format";
import { PassThrough } from "stream";

const prisma = new PrismaClient();

class ExportGuestService {
  async getAllGuests() {
    return await prisma.guest.findMany({
      orderBy: { id: "desc" },
    });
  }

  async exportGuestsToCSVStream() {
    const guests = await this.getAllGuests();

    if (!guests || guests.length === 0) {
      throw new Error("Tidak ada data tamu untuk diexport");
    }

    const csvStream = format({ headers: true });
    const passthrough = new PassThrough();

    guests.forEach((guest) => {
      csvStream.write({
        ID: guest.id,
        Fullname: guest.fullname,
        ID_Card: guest.id_card,
        Email: guest.email || "",
        Phone: guest.phone || "",
        Company: guest.company || "",
        Visit_Purpose: guest.visit_purpose || "",
        Visit_Date: guest.visit_date,
        Check_In: guest.check_in,
        Check_Out: guest.check_out,
        Status: guest.status,
        Created_At: guest.created_at,
        Updated_At: guest.updated_at,
      });
    });

    csvStream.end();
    csvStream.pipe(passthrough);

    return passthrough;
  }
}

export default new ExportGuestService();
