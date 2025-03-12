import Product from "@/models/Product";

describe("src/models/Product.ts", () => {
  describe("Successfull Cases", () => {
    test("Should create a new product", () => {
      const product = new Product("Mouse", 199.99, 1);

      expect(product.getProduct()).toEqual({
        name: "Mouse",
        price: 199.99,
        quantity: 1,
      });
    });
  });

  describe("Failure Cases", () => {
    test("Should throw an error if name is not valid", () => {
      const product = new Product(" ", 199.99, 1);

      expect(() => product.getProduct()).toThrow("Nome do produto inválido.");
    });

    test("Should throw an error if price is not valid", () => {
      const product = new Product("Mouse", 0, 1);

      expect(() => product.getProduct()).toThrow("Preço do produto inválido.");
    });

    test("Should throw an error if quantity is not valid", () => {
      const product = new Product("Mouse", 199.99, 0);

      expect(() => product.getProduct()).toThrow("Quantidade do produto inválida.");
    });
  });
});
