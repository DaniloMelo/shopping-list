import { prisma } from "@/lib/prisma";
import ShoppingListRepository from "@/repository/ShoppingListRepository";

jest.mock("../../../../src/lib/prisma", () => ({
  prisma: {
    shoppingList: {
      create: jest.fn(),
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
  });

  //describe("Failure Cases", () => {});
});
