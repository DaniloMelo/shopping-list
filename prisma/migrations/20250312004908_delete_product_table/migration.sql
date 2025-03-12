/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ProductName` to the `ShoppingList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductPrice` to the `ShoppingList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductQuantity` to the `ShoppingList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_shoppingListId_fkey";

-- DropIndex
DROP INDEX "ShoppingList_userId_key";

-- AlterTable
ALTER TABLE "ShoppingList" ADD COLUMN     "ProductName" TEXT NOT NULL,
ADD COLUMN     "ProductPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ProductQuantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Product";
