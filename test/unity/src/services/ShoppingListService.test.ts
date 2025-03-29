import { InternalServerError } from "@/lib/CustomErrors";
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
  findAll: jest.fn(),
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
      test("Should throw ModelValidationError if product name is invalid", async () => {
        const newProduct = {
          productName: " ",
          productPrice: 199.99,
          productQuantity: 1,
          userId: "123456",
        };

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow("Nome inválido.");
      });

      test("Should throw ModelValidationError if product price is invalid", async () => {
        const newProduct = {
          productName: "Mouse",
          productPrice: 0,
          productQuantity: 1,
          userId: "123456",
        };

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow("Preço inválido.");
      });

      test("Should throw ModelValidationError if product quantity is invalid", async () => {
        const newProduct = {
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 0,
          userId: "123456",
        };

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow("Quantidade inválida.");
      });

      test("Should throw InternalServerError if a unexpected error occurs during product creation", async () => {
        const newProduct = {
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          userId: "123456",
        };

        mockUserRepository.findUserById.mockRejectedValue(new Error("Unexpected error."));

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow(InternalServerError);
        await shoppingListService.createProduct(newProduct).catch((error) => {
          expect(error.message).toBe("Ocorreu um erro inesperado ao tentar adicionar um novo produto.");
        });
        expect(mockUserRepository.findUserById).toHaveBeenCalledWith("123456");
      });
    });
  });

  describe("listProducts method: ", () => {
    describe("Successfull Cases", () => {
      test("Should find and return all products", async () => {
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

        mockShoppingListRepository.findAll.mockResolvedValue(dbProducts);

        const result = await shoppingListService.listProducts("123abc");

        expect(mockShoppingListRepository.findAll).toHaveBeenCalledWith("123abc");
        expect(result).toEqual(dbProducts);
      });

      test("Should return an empty array if the user has no products", async () => {
        mockShoppingListRepository.findAll.mockResolvedValue([]);

        const result = await shoppingListService.listProducts("123abc");

        expect(mockShoppingListRepository.findAll).toHaveBeenCalledWith("123abc");
        expect(result).toEqual([]);
      });
    });

    describe("Failure Cases", () => {
      test("Should throw InternalServerError if a unexpected error occurs during get product list", async () => {
        mockShoppingListRepository.findAll.mockRejectedValue(new Error("Unexpected error."));

        await expect(shoppingListService.listProducts("123abc")).rejects.toThrow(InternalServerError);
        await shoppingListService.listProducts("123abc").catch((error) => {
          expect(error.message).toBe("Ocorreu um erro inesperado ao tentar buscar a lista de produtos.");
        });
        expect(mockShoppingListRepository.findAll).toHaveBeenCalledWith("123abc");
      });
    });
  });
});
