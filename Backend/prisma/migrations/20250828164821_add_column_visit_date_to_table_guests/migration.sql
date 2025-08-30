/*
  Warnings:

  - Added the required column `visit_date` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Guest" ADD COLUMN     "visit_date" DATE NOT NULL;
