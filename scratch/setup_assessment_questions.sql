-- 1. Create the new join table if it does not exist
CREATE TABLE IF NOT EXISTS "assessment_questions" (
  "id" TEXT NOT NULL,
  "assessmentId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "questionNumber" INTEGER NOT NULL,
  CONSTRAINT "assessment_questions_pkey" PRIMARY KEY ("id")
);

-- 2. Create the unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "assessment_questions_assessmentId_questionId_key" ON "assessment_questions"("assessmentId", "questionId");
CREATE UNIQUE INDEX IF NOT EXISTS "assessment_questions_assessmentId_questionNumber_key" ON "assessment_questions"("assessmentId", "questionNumber");

-- 3. Add Foreign Key to Assessment (Cascade)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assessment_questions_assessmentId_fkey') THEN
        ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assessmentId_fkey" 
        FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- 4. Add Foreign Key to Question (Restrict)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assessment_questions_questionId_fkey') THEN
        ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_questionId_fkey" 
        FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
