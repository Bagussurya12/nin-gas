import fetch from "node-fetch";
import { parse } from "csv-parse/sync";
import { parse as parseDate } from "date-fns";
import { id } from "date-fns/locale";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const SHEET_CSV_URL = process.env.GSHEET_LINK;

function parseMenuAnswer(val) {
  if (!val) return false;
  return (
    val.toLowerCase().startsWith("ya") || val.toLowerCase().startsWith("opsi")
  );
}

function getWeekDate(dayName, baseDate) {
  const map = {
    Senin: 1,
    Selasa: 2,
    Rabu: 3,
    Kamis: 4,
    Jumat: 5,
  };

  const date = new Date(baseDate);
  if (isNaN(date)) return null;

  const currentDay = date.getDay(); // Minggu=0, Senin=1, ...
  const targetDay = map[dayName];
  if (!targetDay) return null;

  let diff = targetDay - currentDay;
  if (diff < 0) diff += 7;

  date.setDate(date.getDate() + diff);
  return date;
}

function parseTimestamp(timestamp) {
  if (!timestamp) return null;

  const formats = [
    "dd/MM/yyyy HH:mm:ss", // format default (Indonesia)
    "MM/dd/yyyy HH:mm:ss", // kalau locale en-US
    "yyyy-MM-dd HH:mm:ss", // kadang CSV export
    "dd/MM/yyyy", // kalau cuma tanggal
    "MM/dd/yyyy", // fallback US hanya tanggal
  ];

  for (const fmt of formats) {
    try {
      const date = parseDate(timestamp, fmt, new Date(), { locale: id });
      if (!isNaN(date)) return date;
    } catch (e) {}
  }

  return null;
}

async function syncData() {
  try {
    console.log("Fetching CSV from:", SHEET_CSV_URL);
    const res = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    const records = parse(text, { columns: true });

    for (const row of records) {
      const prNumber = row["PR Number"];
      const name = row["Nama"];
      const email = row["Email"];
      const section = row["Section"];
      const timestamp = row["Timestamp"];

      let baseDate = parseTimestamp(timestamp);

      if (!baseDate) {
        console.warn(
          `Invalid timestamp "${timestamp}" for PR ${prNumber}, skip...`
        );
        continue;
      }

      // cek MempData sudah ada
      const memp = await prisma.mempData.findUnique({
        where: { strprno: prNumber },
      });

      if (!memp) {
        console.warn(
          `⚠️ MempData not found for PR Number ${prNumber}, skip...`
        );
        continue;
      }

      // buat MealRequest
      const mealRequest = await prisma.mealRequest.create({
        data: {
          pr_number: prNumber,
          email: email,
          name: name,
          section: section,
          confirmation: true,
        },
      });

      // siapkan detail
      const details = [];
      const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

      for (const day of days) {
        const answer = row[`${day}`];
        if (answer) {
          const date = getWeekDate(day, baseDate);
          if (!date || isNaN(date)) {
            console.warn(`⚠️ Invalid date for ${day} PR ${prNumber}`);
            continue;
          }

          details.push({
            meal_request_id: mealRequest.id,
            date,
            is_selected: parseMenuAnswer(answer),
          });
        }
      }

      if (details.length > 0) {
        await prisma.mealRequestDetail.createMany({ data: details });
      }

      console.log(`Synced MealRequest for PR ${prNumber}`);
    }
  } catch (err) {
    console.error("Error syncing data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

syncData();
