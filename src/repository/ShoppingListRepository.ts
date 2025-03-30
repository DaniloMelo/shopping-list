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

export interface IUpdateProduct {
  productName: string;
  productPrice: number;
  productQuantity: number;
}

export interface IShoppingListRepository {
  create(newProductObj: INewProduct): Promise<void>;
  findAll(userId: string): Promise<IDbProduct[] | []>;
  fullUpdate(productId: string, product: IUpdateProduct): Promise<void>;
  partialUpdate(productId: string, product: Partial<INewProduct>): Promise<void>;
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

  async fullUpdate(prodId: string, product: IUpdateProduct): Promise<void> {
    await prisma.shoppingList.update({
      where: { id: prodId },
      data: product,
    });
  }

  async partialUpdate(productId: string, PartialProduct: Partial<INewProduct>): Promise<void> {
    await prisma.shoppingList.update({
      where: { id: productId },
      data: PartialProduct,
    });
  }
}
