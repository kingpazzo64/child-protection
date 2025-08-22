/*
  Warnings:

  - The values [CRITICAL,HIGH,MEDIUM,LOW] on the enum `Urgency` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `serviceTypeId` on the `Directory` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Urgency_new" AS ENUM ('VICTIMS_OF_ABUSE_EXPLOITATION', 'STREET_CHILDREN', 'REFUGEE_CHILDREN', 'CHILDREN_WITH_DISABILITIES', 'EXTREME_POVERTY', 'SEPARATED_OR_ABANDONED', 'CHILDREN_IN_JUSTICE_SYSTEM', 'HARMFUL_PRACTICES');
ALTER TABLE "Directory" ALTER COLUMN "urgency" DROP DEFAULT;
ALTER TABLE "Directory" ALTER COLUMN "urgency" TYPE "Urgency_new" USING ("urgency"::text::"Urgency_new");
ALTER TYPE "Urgency" RENAME TO "Urgency_old";
ALTER TYPE "Urgency_new" RENAME TO "Urgency";
DROP TYPE "Urgency_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Directory" DROP CONSTRAINT "Directory_serviceTypeId_fkey";

-- AlterTable
ALTER TABLE "Directory" DROP COLUMN "serviceTypeId",
ALTER COLUMN "urgency" DROP DEFAULT;

-- CreateTable
CREATE TABLE "DirectoryService" (
    "id" SERIAL NOT NULL,
    "directoryId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "DirectoryService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DirectoryService" ADD CONSTRAINT "DirectoryService_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "Directory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectoryService" ADD CONSTRAINT "DirectoryService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
