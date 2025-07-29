/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DirectoryToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DirectoryToTag" DROP CONSTRAINT "_DirectoryToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_DirectoryToTag" DROP CONSTRAINT "_DirectoryToTag_B_fkey";

-- AlterTable
ALTER TABLE "Directory" ADD COLUMN     "location" TEXT,
ADD COLUMN     "otherServices" TEXT;

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_DirectoryToTag";
