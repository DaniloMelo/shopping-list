import { ModelValidationError } from "@/lib/CustomErrors";

export default class Price {
  private readonly price: number;

  constructor(price: number) {
    if (price <= 0) {
      throw new ModelValidationError("Preço inválido.", "O preço deve ser maior que R$ 0,00", 400, true);
    }

    this.price = price;
  }

  getValue() {
    return this.price;
  }
}
