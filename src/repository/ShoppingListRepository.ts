import { prisma } from "@/lib/prisma";
import { INewProduct } from "@/services/ShoppingListService";

export interface IDbProduct {
  id: string;
  createdAt: Date;
  userId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  updatedAt: Date;
}

export interface IShoppingListRepository {
  create(newProductObj: INewProduct): Promise<void>;
  findAll(userId: string): Promise<IDbProduct[] | []>;
}

export default class ShoppingListRepository implements IShoppingListRepository {
  async create(newProductObj: INewProduct): Promise<void> {
    await prisma.shoppingList.create({
      data: newProductObj,
    });
  }

  async findAll(userId: string): Promise<IDbProduct[] | []> {
    return await prisma.shoppingList.findMany({
      where: { userId },
    });
  }
}
