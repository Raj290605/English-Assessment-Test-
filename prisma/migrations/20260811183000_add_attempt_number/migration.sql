-- Add attempt number to existing assessments.
-- Existing assessments temporarily receive Attempt 1.

ALTER TABLE "assessments"
ADD COLUMN "attemptNumber" INTEGER NOT NULL DEFAULT 1;

-- Assign existing assessments sequential attempt numbers.
-- The oldest assessment for each student becomes Attempt 1,
-- the next becomes Attempt 2, etc.
WITH ranked_assessments AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "studentId"
            ORDER BY "createdAt" ASC, "id" ASC
        ) AS "attemptNumber"
    FROM "assessments"
)
UPDATE "assessments" AS a
SET "attemptNumber" = r."attemptNumber"
FROM ranked_assessments AS r
WHERE a."id" = r."id";

-- Prevent duplicate attempt numbers for the same student.
CREATE UNIQUE INDEX "assessments_studentId_attemptNumber_key"
ON "assessments" ("studentId", "attemptNumber");