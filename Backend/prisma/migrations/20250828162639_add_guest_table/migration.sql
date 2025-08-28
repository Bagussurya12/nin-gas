-- CreateTable
CREATE TABLE "public"."Guest" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "id_card" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "visit_purpose" TEXT,
    "status" TEXT NOT NULL DEFAULT 'expected',
    "check_in" TIMESTAMP(3),
    "check_out" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);
