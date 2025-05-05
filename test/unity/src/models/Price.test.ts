import { ModelValidationError } from "@/lib/CustomErrors";
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
      try {
        new Price(0);
      } catch (error) {
        expect(error).toBeInstanceOf(ModelValidationError);

        if (error instanceof ModelValidationError) {
          expect(error.message).toBe("Preço inválido.");
          expect(error.action).toBe("O preço deve ser maior que R$ 0,00");
        }
      }
    });
  });
});
