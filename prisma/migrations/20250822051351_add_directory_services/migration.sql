/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `long` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Directory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Directory" DROP COLUMN "createdAt",
DROP COLUMN "lat",
DROP COLUMN "long",
DROP COLUMN "updatedAt";
