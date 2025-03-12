/*
  Warnings:

  - You are about to drop the column `ProductName` on the `ShoppingList` table. All the data in the column will be lost.
  - You are about to drop the column `ProductPrice` on the `ShoppingList` table. All the data in the column will be lost.
  - You are about to drop the column `ProductQuantity` on the `ShoppingList` table. All the data in the column will be lost.
  - Added the required column `productName` to the `ShoppingList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productPrice` to the `ShoppingList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productQuantity` to the `ShoppingList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShoppingList" DROP COLUMN "ProductName",
DROP COLUMN "ProductPrice",
DROP COLUMN "ProductQuantity",
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "productQuantity" INTEGER NOT NULL;
