-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "paymentId" TEXT;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
