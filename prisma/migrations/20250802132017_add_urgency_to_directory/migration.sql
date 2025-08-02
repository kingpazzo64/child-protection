-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- AlterTable
ALTER TABLE "Directory" ADD COLUMN     "urgency" "Urgency" NOT NULL DEFAULT 'MEDIUM';
