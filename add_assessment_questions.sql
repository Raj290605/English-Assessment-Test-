CREATE TABLE "assessment_questions" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    CONSTRAINT "assessment_questions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "assessment_questions_assessmentId_questionId_key" ON "assessment_questions"("assessmentId", "questionId");
CREATE UNIQUE INDEX "assessment_questions_assessmentId_questionNumber_key" ON "assessment_questions"("assessmentId", "questionNumber");

ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON UPDATE CASCADE;
