import Quantity from "@/models/Quantity";

describe("src/models/Quantity.ts", () => {
  describe("Successfull Cases", () => {
    test("Should return a valid quantity", () => {
      const q = new Quantity(3);

      expect(q.getValue()).toBe(3);
    });
  });

  describe("Failure Cases", () => {
    test("Should throw an error if quantity is equal or less than 0", () => {
      expect(() => new Quantity(0)).toThrow("Quantidade inválida.");
      expect(() => new Quantity(-1)).toThrow("Quantidade inválida.");
    });
  });
});
