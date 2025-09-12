/*
  Warnings:

  - Added the required column `menu_id` to the `MealRequestDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MealRequestDetail" ADD COLUMN     "menu_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MenuNutrition" (
    "id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "calories" INTEGER,
    "protein" DECIMAL(5,2),
    "carbs" DECIMAL(5,2),
    "fat" DECIMAL(5,2),
    "sugar" DECIMAL(5,2),
    "fiber" DECIMAL(5,2),
    "sodium" DECIMAL(6,2),

    CONSTRAINT "MenuNutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MenuImage" (
    "id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuNutrition_menu_id_key" ON "public"."MenuNutrition"("menu_id");

-- CreateIndex
CREATE INDEX "MenuImage_menu_id_idx" ON "public"."MenuImage"("menu_id");

-- CreateIndex
CREATE INDEX "MealRequestDetail_menu_id_idx" ON "public"."MealRequestDetail"("menu_id");

-- AddForeignKey
ALTER TABLE "public"."MealRequestDetail" ADD CONSTRAINT "MealRequestDetail_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuNutrition" ADD CONSTRAINT "MenuNutrition_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuImage" ADD CONSTRAINT "MenuImage_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
