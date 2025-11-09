-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'DISTRICT_CPO';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "districtId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
