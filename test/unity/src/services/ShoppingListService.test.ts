import { InternalServerError, ModelValidationError, ProductServiceError } from "@/lib/CustomErrors";
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
  findById: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
  deleteSelected: jest.fn(),
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

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow(ModelValidationError);

        await shoppingListService.createProduct(newProduct).catch((error) => {
          expect(error.message).toBe("Nome inválido.");
          expect(error.action).toBe("Nome precisa ter 3 ou mais caracteres.");
        });
      });

      test("Should throw ModelValidationError if product price is invalid", async () => {
        const newProduct = {
          productName: "Mouse",
          productPrice: 0,
          productQuantity: 1,
          userId: "123456",
        };

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow(ModelValidationError);

        await shoppingListService.createProduct(newProduct).catch((error) => {
          expect(error.message).toBe("Preço inválido.");
          expect(error.action).toBe("O preço deve ser maior que R$ 0,00");
        });
      });

      test("Should throw ModelValidationError if product quantity is invalid", async () => {
        const newProduct = {
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 0,
          userId: "123456",
        };

        await expect(shoppingListService.createProduct(newProduct)).rejects.toThrow(ModelValidationError);

        await shoppingListService.createProduct(newProduct).catch((error) => {
          expect(error.message).toBe("Quantidade inválida.");
          expect(error.action).toBe("A quantidade deve ser maior que 0.");
        });
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

        expect(mockUserRepository.findUserById).toHaveBeenCalledWith("123456");

        await shoppingListService.createProduct(newProduct).catch((error) => {
          expect(error.message).toBe("Ocorreu um erro inesperado ao tentar adicionar um novo produto.");
          expect(error.action).toBe("Tente novamente mais tarde.");
        });
      });
    });
  });

  describe("listProducts method:", () => {
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

        expect(mockShoppingListRepository.findAll).toHaveBeenCalledWith("123abc");

        await shoppingListService.listProducts("123abc").catch((error) => {
          expect(error.message).toBe("Ocorreu um erro inesperado ao tentar buscar a lista de produtos.");
          expect(error.action).toBe("Tente novamente mais tarde.");
        });
      });
    });
  });

  describe("updateProduct method:", () => {
    describe("Successfull Cases", () => {
      test("Should update product successfully", async () => {
        const dbProduct = {
          id: "098zxc",
          createdAt: new Date(),
          userId: "123abc",
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          updatedAt: new Date(),
        };

        const updatedProduct = {
          productName: "Updated-name",
          productPrice: 299.99,
          productQuantity: 2,
        };

        mockShoppingListRepository.findById.mockResolvedValue(dbProduct);

        await expect(shoppingListService.updateProduct("123abc", "098zxc", updatedProduct)).resolves.toBeUndefined();
        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("098zxc");
      });
    });

    describe("Failure Cases", () => {
      test("Should throw ProductServiceError when product not found", async () => {
        const updatedProduct = {
          productName: "Updated-name",
          productPrice: 299.99,
          productQuantity: 2,
        };

        mockShoppingListRepository.findById.mockResolvedValue(null);

        await expect(
          shoppingListService.updateProduct("123abc", "unexistent-product-id", updatedProduct),
        ).rejects.toThrow(ProductServiceError);

        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("unexistent-product-id");

        await shoppingListService.updateProduct("123abc", "unexistent-product-id", updatedProduct).catch((error) => {
          expect(error.message).toBe("Product not found.");
          expect(error.action).toBe("Verify the provided ID");
        });
      });

      test("Should throw ProductServiceError when user ID and user ID in product are different", async () => {
        const dbProduct = {
          id: "098zxc",
          createdAt: new Date(),
          userId: "123abc",
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          updatedAt: new Date(),
        };

        const updatedProduct = {
          productName: "Updated-name",
          productPrice: 299.99,
          productQuantity: 2,
        };

        mockShoppingListRepository.findById.mockResolvedValue(dbProduct);

        await expect(shoppingListService.updateProduct("different-user-id", "098zxc", updatedProduct)).rejects.toThrow(
          ProductServiceError,
        );

        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("098zxc");

        await shoppingListService.updateProduct("different-user-id", "098zxc", updatedProduct).catch((error) => {
          expect(error.message).toBe("Permision Denied.");
          expect(error.action).toBe("Permision Denied.");
        });
      });

      test("Should throw ModelValidationError if product name is invalid", async () => {
        const dbProduct = {
          id: "098zxc",
          createdAt: new Date(),
          userId: "123abc",
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          updatedAt: new Date(),
        };

        const updatedProduct = {
          productName: "x",
          productPrice: 299.99,
          productQuantity: 2,
        };

        mockShoppingListRepository.findById.mockResolvedValue(dbProduct);

        await expect(shoppingListService.updateProduct("123abc", "098zxc", updatedProduct)).rejects.toThrow(
          ModelValidationError,
        );

        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("098zxc");

        await shoppingListService.updateProduct("123abc", "098zxc", updatedProduct).catch((error) => {
          expect(error.message).toBe("Nome inválido.");
          expect(error.action).toBe("Nome precisa ter 3 ou mais caracteres.");
        });
      });

      test("Should throw ModelValidationError if product price is invalid", async () => {
        const dbProduct = {
          id: "098zxc",
          createdAt: new Date(),
          userId: "123abc",
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          updatedAt: new Date(),
        };

        const updatedProduct = {
          productName: "Updated-name",
          productPrice: 0,
          productQuantity: 2,
        };

        mockShoppingListRepository.findById.mockResolvedValue(dbProduct);

        await expect(shoppingListService.updateProduct("123abc", "098zxc", updatedProduct)).rejects.toThrow(
          ModelValidationError,
        );

        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("098zxc");

        await shoppingListService.updateProduct("123abc", "098zxc", updatedProduct).catch((error) => {
          expect(error.message).toBe("Preço inválido.");
          expect(error.action).toBe("O preço deve ser maior que R$ 0,00");
        });
      });

      test("Should throw ModelValidationError if product quantity is invalid", async () => {
        const dbProduct = {
          id: "098zxc",
          createdAt: new Date(),
          userId: "123abc",
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          updatedAt: new Date(),
        };

        const updatedProduct = {
          productName: "Updated-name",
          productPrice: 2,
          productQuantity: 0,
        };

        mockShoppingListRepository.findById.mockResolvedValue(dbProduct);

        await expect(shoppingListService.updateProduct("123abc", "098zxc", updatedProduct)).rejects.toThrow(
          ModelValidationError,
        );

        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("098zxc");

        await shoppingListService.updateProduct("123abc", "098zxc", updatedProduct).catch((error) => {
          expect(error.message).toBe("Quantidade inválida.");
          expect(error.action).toBe("A quantidade deve ser maior que 0.");
        });
      });

      test("Should throw InternalServerError if a unexpected error occurs during product update", async () => {
        const updatedProduct = {
          productName: "Updated-name",
          productPrice: 299.99,
          productQuantity: 2,
        };

        mockShoppingListRepository.findById.mockRejectedValue(new Error("Unexpected Error."));

        await expect(shoppingListService.updateProduct("123abc", "098zxc", updatedProduct)).rejects.toThrow(
          InternalServerError,
        );

        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("098zxc");

        await shoppingListService.updateProduct("123abc", "098zxc", updatedProduct).catch((error) => {
          expect(error.message).toBe("Ocorreu um erro inesperado ao tentar atualizar o produto.");
          expect(error.action).toBe("Tente novamente mais tarde.");
        });
      });
    });
  });

  describe("deleteProduct method:", () => {
    describe("Successfull Cases", () => {
      test("Should delete product", async () => {
        const dbProduct = {
          id: "098zxc",
          createdAt: new Date(),
          userId: "123abc",
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          updatedAt: new Date(),
        };

        mockShoppingListRepository.findById.mockResolvedValue(dbProduct);
        mockShoppingListRepository.deleteById.mockResolvedValue(undefined);

        await expect(shoppingListService.deleteProduct("098zxc", "123abc")).resolves.toBeUndefined();
        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("098zxc");
        expect(mockShoppingListRepository.deleteById).toHaveBeenCalledWith("098zxc", "123abc");
      });
    });

    describe("Failure Cases", () => {
      test("Should throw ProductServiceError when product not found", async () => {
        mockShoppingListRepository.findById.mockResolvedValue(null);

        await expect(shoppingListService.deleteProduct("unexistent-product-id", "abc123")).rejects.toThrow(
          ProductServiceError,
        );

        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("unexistent-product-id");

        await shoppingListService.deleteProduct("unexistent-product-id", "abc123").catch((error) => {
          expect(error.message).toBe("Product not found.");
          expect(error.action).toBe("Verify the provided ID");
        });
      });

      test("Should throw ProductServiceError when user ID and user ID in product are different", async () => {
        const dbProduct = {
          id: "098zxc",
          createdAt: new Date(),
          userId: "123abc",
          productName: "Mouse",
          productPrice: 199.99,
          productQuantity: 1,
          updatedAt: new Date(),
        };

        mockShoppingListRepository.findById.mockResolvedValue(dbProduct);

        await expect(shoppingListService.deleteProduct("098zxc", "different-user-id")).rejects.toThrow(
          ProductServiceError,
        );

        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("098zxc");

        await shoppingListService.deleteProduct("098zxc", "different-user-id").catch((error) => {
          expect(error.message).toBe("Permision Denied.");
          expect(error.action).toBe("Permision Denied.");
        });
      });

      test("Should throw InternalServerError if unexpected error occurs during delete one product", async () => {
        mockShoppingListRepository.findById.mockRejectedValue(new Error("Unexpected error."));

        await expect(shoppingListService.deleteProduct("123", "321")).rejects.toThrow(InternalServerError);

        expect(mockShoppingListRepository.findById).toHaveBeenCalledWith("123");

        await shoppingListService.deleteProduct("123", "321").catch((error) => {
          expect(error.message).toBe("Ocorreu um erro inesperado ao tentar excluir o produto.");
          expect(error.action).toBe("Tente novamente mais tarde.");
        });
      });
    });
  });

  describe("deleteSelectedProducts method:", () => {
    describe("Sucessfull Cases", () => {
      test("Should delete selected products", async () => {
        mockShoppingListRepository.deleteSelected.mockResolvedValue(undefined);

        await expect(
          shoppingListService.deleteSelectedProducts(["123", "456", "789"], "123abc"),
        ).resolves.toBeUndefined();

        expect(mockShoppingListRepository.deleteSelected).toHaveBeenCalledWith(["123", "456", "789"], "123abc");
      });
    });

    describe("Failure Cases", () => {
      test("Should throw InternalServerError if unexpected error occurs during delete selected products", async () => {
        mockShoppingListRepository.deleteSelected.mockRejectedValue(new Error("Unexpected error."));

        await expect(shoppingListService.deleteSelectedProducts(["123", "456", "789"], "123abc")).rejects.toThrow(
          InternalServerError,
        );

        await shoppingListService.deleteSelectedProducts(["123", "456", "789"], "123abc").catch((error) => {
          expect(error.message).toBe("Ocorreu um erro inesperado ao tentar excluir os produtos selecionados.");
          expect(error.action).toBe("Tente novamente mais tarde.");
        });
      });
    });
  });
});
