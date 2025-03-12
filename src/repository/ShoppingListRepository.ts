import { prisma } from "@/lib/prisma";
import { INewProduct } from "@/services/ShoppingListService";

export interface IShoppingListRepository {
  create(newProductObj: INewProduct): Promise<void>;
}

export default class ShoppingListRepository implements IShoppingListRepository {
  async create(newProductObj: INewProduct): Promise<void> {
    await prisma.shoppingList.create({
      data: newProductObj,
    });
  }
}
