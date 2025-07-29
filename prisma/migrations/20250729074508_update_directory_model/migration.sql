/*
  Warnings:

  - You are about to drop the column `location` on the `Directory` table. All the data in the column will be lost.
  - Added the required column `lat` to the `Directory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `long` to the `Directory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Directory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Directory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Directory" DROP COLUMN "location",
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "long" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" TEXT NOT NULL,
ALTER COLUMN "paid" SET DEFAULT false;
