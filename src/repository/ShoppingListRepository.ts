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
  findById(productId: string): Promise<IDbProduct | null>;
  update(productId: string, product: Partial<IUpdateProduct>): Promise<void>;
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

  async findById(productId: string): Promise<IDbProduct | null> {
    return await prisma.shoppingList.findUnique({
      where: { id: productId },
    });
  }

  async update(productId: string, PartialProduct: Partial<INewProduct>): Promise<void> {
    await prisma.shoppingList.update({
      where: { id: productId },
      data: PartialProduct,
    });
  }
}
