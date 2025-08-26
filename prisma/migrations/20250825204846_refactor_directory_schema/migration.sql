/*
  Warnings:

  - You are about to drop the column `amount` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `cellId` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `districtId` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedAttendance` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `sectorId` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `urgency` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `villageId` on the `Directory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Directory" DROP CONSTRAINT "Directory_cellId_fkey";

-- DropForeignKey
ALTER TABLE "Directory" DROP CONSTRAINT "Directory_districtId_fkey";

-- DropForeignKey
ALTER TABLE "Directory" DROP CONSTRAINT "Directory_sectorId_fkey";

-- DropForeignKey
ALTER TABLE "Directory" DROP CONSTRAINT "Directory_villageId_fkey";

-- AlterTable
ALTER TABLE "Directory" DROP COLUMN "amount",
DROP COLUMN "cellId",
DROP COLUMN "description",
DROP COLUMN "districtId",
DROP COLUMN "estimatedAttendance",
DROP COLUMN "sectorId",
DROP COLUMN "urgency",
DROP COLUMN "villageId";

-- DropEnum
DROP TYPE "Urgency";

-- CreateTable
CREATE TABLE "BeneficiaryType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "BeneficiaryType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectoryBeneficiary" (
    "id" SERIAL NOT NULL,
    "directoryId" INTEGER NOT NULL,
    "beneficiaryId" INTEGER NOT NULL,

    CONSTRAINT "DirectoryBeneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectoryLocation" (
    "id" SERIAL NOT NULL,
    "directoryId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "sectorId" INTEGER NOT NULL,
    "cellId" INTEGER NOT NULL,
    "villageId" INTEGER NOT NULL,

    CONSTRAINT "DirectoryLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BeneficiaryType_name_key" ON "BeneficiaryType"("name");

-- AddForeignKey
ALTER TABLE "DirectoryBeneficiary" ADD CONSTRAINT "DirectoryBeneficiary_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "Directory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectoryBeneficiary" ADD CONSTRAINT "DirectoryBeneficiary_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "BeneficiaryType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectoryLocation" ADD CONSTRAINT "DirectoryLocation_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "Directory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectoryLocation" ADD CONSTRAINT "DirectoryLocation_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectoryLocation" ADD CONSTRAINT "DirectoryLocation_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectoryLocation" ADD CONSTRAINT "DirectoryLocation_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "Cell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectoryLocation" ADD CONSTRAINT "DirectoryLocation_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "Village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
