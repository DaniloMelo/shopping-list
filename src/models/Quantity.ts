import { ModelValidationError } from "@/lib/CustomErrors";

export default class Quantity {
  private readonly quantity: number;

  constructor(quantity: number) {
    if (quantity <= 0) {
      throw new ModelValidationError("Quantidade inválida.", "A quantidade deve ser maior que 0.", 400, true);
    }

    this.quantity = quantity;
  }

  getValue() {
    return this.quantity;
  }
}
