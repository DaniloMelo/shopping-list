/*
  Warnings:

  - You are about to alter the column `productPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "productPrice" SET DATA TYPE INTEGER;
