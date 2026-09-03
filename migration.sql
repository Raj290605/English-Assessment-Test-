-- DropForeignKey
ALTER TABLE "assessment_questions" DROP CONSTRAINT "assessment_questions_questionId_fkey";

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "questionSetId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "questionSetId" TEXT;



-- CreateTable
CREATE TABLE "question_sets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_sets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "question_sets_name_key" ON "question_sets"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "question_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "question_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

