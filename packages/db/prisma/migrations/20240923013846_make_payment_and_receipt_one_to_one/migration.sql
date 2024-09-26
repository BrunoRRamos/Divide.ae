/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `Receipt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Receipt_paymentId_key" ON "Receipt"("paymentId");
