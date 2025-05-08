import { prisma } from "@/lib/prisma";
import ShoppingListRepository from "@/repository/ShoppingListRepository";

jest.mock("../../../../src/lib/prisma", () => ({
  prisma: {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
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

      (prisma.product.create as jest.Mock).mockResolvedValue(undefined);

      await shoppingListRepository.create(newProduct);

      expect(prisma.product.create).toHaveBeenCalledWith({
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

      (prisma.product.findMany as jest.Mock).mockResolvedValue(dbProducts);

      const result = await shoppingListRepository.findAll("123abc");

      expect(prisma.product.findMany).toHaveBeenCalledWith({
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

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(dbProduct);

      const result = await shoppingListRepository.findById("098zxc");

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
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

      (prisma.product.update as jest.Mock).mockResolvedValue(undefined);

      await shoppingListRepository.update("098zxc", updatedProduct);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: "098zxc" },
        data: updatedProduct,
      });
    });

    test("Should delete one product", async () => {
      (prisma.product.delete as jest.Mock).mockResolvedValue(undefined);

      await shoppingListRepository.deleteById("098zxc", "123abc");

      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: {
          id: "098zxc",
          userId: "123abc",
        },
      });
    });

    test("Should delete selected products", async () => {
      (prisma.product.deleteMany as jest.Mock).mockResolvedValue(undefined);

      await shoppingListRepository.deleteSelected(["123", "456", "789"], "123abc");

      expect(prisma.product.deleteMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ["123", "456", "789"],
          },
          userId: "123abc",
        },
      });
    });
  });

  describe("Failure Cases", () => {
    test("Should return a empty array if user don't have products", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

      const result = await shoppingListRepository.findAll("123abc");

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { userId: "123abc" },
      });
      expect(result).toEqual([]);
    });

    test("Should return null if product don't exist when find by ID", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await shoppingListRepository.findById("unexistent-id");

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: "unexistent-id" },
      });

      expect(result).toBeNull();
    });
  });
});
