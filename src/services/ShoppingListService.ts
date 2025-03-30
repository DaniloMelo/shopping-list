import { InternalServerError, ModelValidationError, ProductServiceError } from "@/lib/CustomErrors";
import Name from "@/models/Name";
import Price from "@/models/Price";
import Product from "@/models/Product";
import Quantity from "@/models/Quantity";
import { IShoppingListRepository, IUpdateProduct } from "@/repository/ShoppingListRepository";
import { IUserRepository } from "@/repository/UserRepository";

export interface INewProduct {
  productName: string;
  productPrice: number;
  productQuantity: number;
  userId: string;
}

export default class ShoppingListService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly shoppingListRepository: IShoppingListRepository,
  ) {}

  async createProduct({ productName, productPrice, productQuantity, userId }: INewProduct) {
    try {
      const productNameObj = new Name(productName);
      const productPriceObj = new Price(productPrice);
      const productQuantityObj = new Quantity(productQuantity);
      const productModel = new Product(productNameObj, productPriceObj, productQuantityObj);
      const product = productModel.getProduct()!;

      const user = await this.userRepository.findUserById(userId);

      const newProduct = { ...product, userId: user?.id };

      await this.shoppingListRepository.create({
        productName: newProduct.name,
        productPrice: newProduct.price,
        productQuantity: newProduct.quantity,
        userId: newProduct.userId!,
      });
    } catch (error) {
      if (error instanceof ModelValidationError) {
        throw error;
      }

      console.error("Error during product creation: ", error);

      throw new InternalServerError(
        "Ocorreu um erro inesperado ao tentar adicionar um novo produto.",
        "Tente novamente mais tarde.",
        500,
        true,
      );
    }
  }

  async listProducts(userId: string) {
    try {
      const list = await this.shoppingListRepository.findAll(userId);

      return list;
    } catch (error) {
      console.error("Error when trying to get product list: ", error);

      throw new InternalServerError(
        "Ocorreu um erro inesperado ao tentar buscar a lista de produtos.",
        "Tente novamente mais tarde.",
        500,
        true,
      );
    }
  }

  async fullUpdateProduct(productId: string, product: IUpdateProduct) {
    try {
      const productName = new Name(product.productName).getValue();
      const productPrice = new Price(product.productPrice).getValue();
      const productQuantity = new Quantity(product.productQuantity).getValue();

      if (!productName || !productPrice || !productQuantity) {
        throw new ProductServiceError(
          "Name, Price and Quantity are required",
          "Provide Name, Price and Quantity",
          400,
          false,
        );
      }

      const updatedProduct = {
        productName,
        productPrice,
        productQuantity,
      };

      await this.shoppingListRepository.fullUpdate(productId, updatedProduct);
    } catch (error) {
      console.log("Error during full update product: ", error);

      if (error instanceof ModelValidationError || error instanceof ProductServiceError) {
        throw error;
      }

      throw new InternalServerError(
        "Ocorreu um Erro inesperado ao tentar atualizar o produto.",
        "Tente novamente mais tarde.",
        500,
        true,
      );
    }
  }

  async partialUpdateProduct(productId: string, product: Partial<INewProduct>) {
    const updatedProduct = {
      productName: product.productName ? new Name(product.productName).getValue() : undefined,
      productPrice: product.productPrice ? new Price(product.productPrice).getValue() : undefined,
      productQuantity: product.productQuantity ? new Quantity(product.productQuantity).getValue() : undefined,
    };

    try {
      await this.shoppingListRepository.partialUpdate(productId, updatedProduct);
    } catch (error) {
      console.log("Error during partial updated product: ", error);

      if (error instanceof ModelValidationError) {
        throw error;
      }

      throw new InternalServerError(
        "Ocorreu um Erro inesperado ao tentar atualizar o produto.",
        "Tente novamente mais tarde.",
        500,
        true,
      );
    }
  }
}
