-- DropForeignKey
ALTER TABLE "InstitutionRating" DROP CONSTRAINT "InstitutionRating_ratingCategoryId_fkey";

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "InstitutionRating" ADD CONSTRAINT "InstitutionRating_ratingCategoryId_fkey" FOREIGN KEY ("ratingCategoryId") REFERENCES "InstitutionRatingCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
