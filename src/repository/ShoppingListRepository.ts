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
  update(productId: string, product: IUpdateProduct): Promise<void>;
  deleteById(productId: string): Promise<void>;
  deleteAll(userId: string): Promise<void>;
}

export default class ShoppingListRepository implements IShoppingListRepository {
  async create(newProductObj: INewProduct): Promise<void> {
    await prisma.product.create({
      data: newProductObj,
    });
  }

  async findAll(userId: string): Promise<IDbProduct[] | []> {
    return await prisma.product.findMany({
      where: { userId },
    });
  }

  async findById(productId: string): Promise<IDbProduct | null> {
    return await prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async update(productId: string, product: IUpdateProduct): Promise<void> {
    await prisma.product.update({
      where: { id: productId },
      data: product,
    });
  }

  async deleteById(productId: string) {
    await prisma.product.delete({
      where: { id: productId },
    });
  }

  async deleteAll(userId: string) {
    await prisma.product.deleteMany({
      where: { userId },
    });
  }
}
