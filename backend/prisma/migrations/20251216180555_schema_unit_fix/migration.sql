-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_buildingId_fkey";

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;
