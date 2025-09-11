/*
  Warnings:

  - You are about to drop the column `email` on the `MealRequest` table. All the data in the column will be lost.
  - You are about to drop the column `is_send_email` on the `MealRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."MealRequest" DROP COLUMN "email",
DROP COLUMN "is_send_email";

-- AlterTable
ALTER TABLE "public"."MealRequestDetail" ADD COLUMN     "is_taken" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taken_at" TIMESTAMP(3);
