-- AlterTable
ALTER TABLE "question_responses" ADD COLUMN     "promptSnapshot" TEXT;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;


