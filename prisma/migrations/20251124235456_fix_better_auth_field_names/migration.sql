/*
  Warnings:

  - You are about to rename the column `passwordHash` to `password` on the `users` table.
  - The `emailVerified` column type is changing from timestamp to boolean.

*/
-- AlterTable: Rename passwordHash to password
ALTER TABLE "users" RENAME COLUMN "passwordHash" TO "password";

-- AlterTable: Change emailVerified from timestamp to boolean
-- First add a new boolean column
ALTER TABLE "users" ADD COLUMN "emailVerified_new" BOOLEAN NOT NULL DEFAULT false;

-- Set emailVerified_new to true if emailVerified timestamp exists, false otherwise
UPDATE "users" SET "emailVerified_new" = CASE WHEN "emailVerified" IS NOT NULL THEN true ELSE false END;

-- Drop old column and rename new column
ALTER TABLE "users" DROP COLUMN "emailVerified";
ALTER TABLE "users" RENAME COLUMN "emailVerified_new" TO "emailVerified";
