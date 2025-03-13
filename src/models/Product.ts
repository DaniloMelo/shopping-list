import { ProductValidationsError } from "@/lib/CustomErrors";

export default class Product {
  constructor(
    private readonly name: string,
    private readonly price: number,
    private readonly quantity: number,
  ) {}

  getProduct() {
    if (this.nameValidation() && this.priceValidation() && this.quantityValidation()) {
      return {
        name: this.name,
        price: this.price,
        quantity: this.quantity,
      };
    }
  }

  private nameValidation() {
    if (this.name.trim().length <= 0) {
      throw new ProductValidationsError("Nome do produto inválido.", "Confira o nome e tente novamente.", 400, true);
    }

    return true;
  }

  private priceValidation() {
    if (this.price <= 0) {
      throw new ProductValidationsError("Preço do produto inválido.", "O preço deve ser maior que R$ 0,00", 400, true);
    }

    return true;
  }

  private quantityValidation() {
    if (this.quantity <= 0) {
      throw new ProductValidationsError(
        "Quantidade do produto inválida.",
        "A quantidade deve ser maior que 0",
        400,
        true,
      );
    }

    return true;
  }
}
