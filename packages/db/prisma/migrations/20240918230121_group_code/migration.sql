/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Group_code_key" ON "Group"("code");
