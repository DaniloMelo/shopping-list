import { prisma } from "@/lib/prisma";
import ShoppingListRepository from "@/repository/ShoppingListRepository";

jest.mock("../../../../src/lib/prisma", () => ({
  prisma: {
    shoppingList: {
      create: jest.fn(),
      findMany: jest.fn(),
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

      (prisma.shoppingList.create as jest.Mock).mockResolvedValue(null);

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
  });
});
