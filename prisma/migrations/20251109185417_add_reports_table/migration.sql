-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('NON_FUNCTIONAL', 'INACTIVE_SERVICE', 'INCORRECT_INFO', 'OTHER');

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" SERIAL NOT NULL,
    "directoryId" INTEGER NOT NULL,
    "reportType" "public"."ReportType" NOT NULL,
    "description" TEXT NOT NULL,
    "reporterName" TEXT,
    "reporterEmail" TEXT,
    "reporterPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "public"."Directory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
