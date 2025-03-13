import { IShoppingListRepository } from "@/repository/ShoppingListRepository";
import { IUserRepository } from "@/repository/UserRepository";
import ShoppingListService from "@/services/ShoppingListService";

const mockUserRepository: jest.Mocked<IUserRepository> = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  updatePassword: jest.fn(),
};

const mockShoppingListRepository: jest.Mocked<IShoppingListRepository> = {
  create: jest.fn(),
};

describe("src/services/ShoppingListService.ts", () => {
  let shoppingListService: ShoppingListService;

  beforeEach(() => {
    jest.clearAllMocks();
    shoppingListService = new ShoppingListService(mockUserRepository, mockShoppingListRepository);
  });

  describe("createProduct method:", () => {
    describe("Successfull Cases", () => {
      test("Should create new product", async () => {
        const user = {
          id: "123456",
          name: "John Doe",
          email: "john@email.com",
          password: "P4ssword!23",
          createdAt: new Date(),
        };

        const newProduct = {
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          userId: "123456",
        };

        mockUserRepository.findUserById.mockResolvedValue(user);
        mockShoppingListRepository.create.mockResolvedValue(undefined);

        await expect(shoppingListService.createProduct(newProduct)).resolves.toBeUndefined();
        expect(mockUserRepository.findUserById).toHaveBeenCalledWith(newProduct.userId);
        expect(mockShoppingListRepository.create).toHaveBeenCalledWith(newProduct);
      });
    });

    describe("Failure Cases", () => {
      test("Should throw ProductValidationError if product name is invalid", async () => {
        const newProduct = {
          productName: " ",
          productPrice: 199.99,
          productQuantity: 1,
          userId: "123456",
        };

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow("Nome do produto inválido.");
      });

      test("Should throw ProductValidationError if product price is invalid", async () => {
        const newProduct = {
          productName: "Mouse",
          productPrice: 0,
          productQuantity: 1,
          userId: "123456",
        };

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow("Preço do produto inválido.");
      });

      test("Should throw ProductValidationError if product quantity is invalid", async () => {
        const newProduct = {
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 0,
          userId: "123456",
        };

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow("Quantidade do produto inválida.");
      });

      test("Shpuld throw InternalServerError if a unexpected error occurs", async () => {
        const newProduct = {
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          userId: "123456",
        };

        const user = {
          id: "123456",
          name: "John Doe",
          email: "john@email.com",
          password: "P4ssword!23",
          createdAt: new Date(),
        };

        (mockUserRepository.findUserById as jest.Mock).mockResolvedValue(user);
        (mockShoppingListRepository.create as jest.Mock).mockRejectedValue(new Error("Unexpected error."));

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow(
          "Ocorreu um erro inesperado ao tentar adicionar um novo produto.",
        );
      });
    });
  });
});
