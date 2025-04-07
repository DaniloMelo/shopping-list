import { prisma } from "@/lib/prisma";
import ShoppingListRepository from "@/repository/ShoppingListRepository";

jest.mock("../../../../src/lib/prisma", () => ({
  prisma: {
    shoppingList: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("src/repository/ShoppingListRepository.ts", () => {
  let shoppingListRepository: ShoppingListRepository;

  beforeEach(() => {
    shoppingListRepository = new ShoppingListRepository();
  });

  describe("Successfull Cases", () => {
    test("Should create a new product on database", async () => {
      const newProduct = {
        productName: "Mouse",
        productPrice: 199.99,
        productQuantity: 1,
        userId: "123456",
      };

      (prisma.shoppingList.create as jest.Mock).mockResolvedValue(undefined);

      await shoppingListRepository.create(newProduct);

      expect(prisma.shoppingList.create).toHaveBeenCalledWith({
        data: newProduct,
      });
    });

    test("Shoult find all products", async () => {
      const dbProducts = [
        {
          id: "098zxc",
          createdAt: new Date(),
          userId: "123abc",
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          updatedAt: new Date(),
        },
      ];

      (prisma.shoppingList.findMany as jest.Mock).mockResolvedValue(dbProducts);

      const result = await shoppingListRepository.findAll("123abc");

      expect(prisma.shoppingList.findMany).toHaveBeenCalledWith({
        where: { userId: "123abc" },
      });
      expect(result).toEqual(dbProducts);
    });

    test("Should find a product by product ID", async () => {
      const dbProduct = {
        id: "098zxc",
        createdAt: new Date(),
        userId: "123abc",
        productName: "Mouse",
        productPrice: 199.99,
        productQuantity: 1,
        updatedAt: new Date(),
      };

      (prisma.shoppingList.findUnique as jest.Mock).mockResolvedValue(dbProduct);

      const result = await shoppingListRepository.findById("098zxc");

      expect(prisma.shoppingList.findUnique).toHaveBeenCalledWith({
        where: { id: "098zxc" },
      });

      expect(result).toEqual(dbProduct);
    });

    test("Should update product", async () => {
      const updatedProduct = {
        productName: "Updated Name",
        productPrice: 199.99,
        productQuantity: 1,
      };

      (prisma.shoppingList.update as jest.Mock).mockResolvedValue(undefined);

      await shoppingListRepository.update("098zxc", updatedProduct);

      expect(prisma.shoppingList.update).toHaveBeenCalledWith({
        where: { id: "098zxc" },
        data: updatedProduct,
      });
    });

    test("Should delete product", async () => {
      (prisma.shoppingList.delete as jest.Mock).mockResolvedValue(undefined);

      await shoppingListRepository.deleteById("098zxc");

      expect(prisma.shoppingList.delete).toHaveBeenCalledWith({
        where: { id: "098zxc" },
      });
    });
  });

  describe("Failure Cases", () => {
    test("Should return a empty array if user don't have products", async () => {
      (prisma.shoppingList.findMany as jest.Mock).mockResolvedValue([]);

      const result = await shoppingListRepository.findAll("123abc");

      expect(prisma.shoppingList.findMany).toHaveBeenCalledWith({
        where: { userId: "123abc" },
      });
      expect(result).toEqual([]);
    });

    test("Should return null if product don't exist when find by ID", async () => {
      (prisma.shoppingList.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await shoppingListRepository.findById("unexistent-id");

      expect(prisma.shoppingList.findUnique).toHaveBeenCalledWith({
        where: { id: "unexistent-id" },
      });

      expect(result).toBeNull();
    });
  });
});
