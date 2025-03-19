import Name from "./Name";
import Price from "./Price";
import Quantity from "./Quantity";

export default class Product {
  constructor(
    private readonly name: Name,
    private readonly price: Price,
    private readonly quantity: Quantity,
  ) {}

  getProduct() {
    return {
      name: this.name.getValue(),
      price: this.price.getValue(),
      quantity: this.quantity.getValue(),
    };
  }
}
