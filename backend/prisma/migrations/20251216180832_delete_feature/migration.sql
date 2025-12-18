-- DropForeignKey
ALTER TABLE "Building" DROP CONSTRAINT "Building_propertyId_fkey";

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
