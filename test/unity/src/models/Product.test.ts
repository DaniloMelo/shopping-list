import Name from "@/models/Name";
import Price from "@/models/Price";
import Product from "@/models/Product";
import Quantity from "@/models/Quantity";

class MockNameClass extends Name {
  constructor() {
    super("Mouse");
  }

  getValue() {
    return "Mouse";
  }
}

class MockPriceClass extends Price {
  constructor() {
    super(199.99);
  }

  getValue() {
    return 199.99;
  }
}

class MockQuantityClass extends Quantity {
  constructor() {
    super(1);
  }

  getValue() {
    return 1;
  }
}

describe("src/models/Product.ts", () => {
  describe("Successfull Cases", () => {
    test("Should create a new product", () => {
      const mockNameObj = new MockNameClass();
      const mockPriceObj = new MockPriceClass();
      const mockQuantityObj = new MockQuantityClass();

      const product = new Product(mockNameObj, mockPriceObj, mockQuantityObj);
      const newProduct = product.getProduct();

      expect(newProduct).toEqual({
        name: "Mouse",
        price: 199.99,
        quantity: 1,
      });
    });
  });
});
