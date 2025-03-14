import { InternalServerError, ProductValidationsError } from "@/lib/CustomErrors";
import Product from "@/models/Product";
import { IShoppingListRepository } from "@/repository/ShoppingListRepository";
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
      const productModel = new Product(productName, productPrice, productQuantity);
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
      if (error instanceof ProductValidationsError) {
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
}
