import Price from "@/models/Price";

describe("src/models/Price.ts", () => {
  describe("Successfull Cases", () => {
    test("Should return a valid price", () => {
      const p = new Price(99.99);

      expect(p.getValue()).toBe(99.99);
    });
  });

  describe("Failure Cases", () => {
    test("Should throw an error if price is equal or less than 0", () => {
      expect(() => new Price(0)).toThrow("Preço inválido.");
      expect(() => new Price(0.0)).toThrow("Preço inválido.");
      expect(() => new Price(-1.11)).toThrow("Preço inválido.");
      expect(() => new Price(-1)).toThrow("Preço inválido.");
    });
  });
});
