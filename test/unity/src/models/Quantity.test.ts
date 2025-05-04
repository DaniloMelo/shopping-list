import { ModelValidationError } from "@/lib/CustomErrors";
import Quantity from "@/models/Quantity";

describe("src/models/Quantity.ts", () => {
  describe("Successfull Cases", () => {
    test("Should return a valid quantity", () => {
      const quantity = new Quantity(3);

      expect(quantity.getValue()).toBe(3);
    });
  });

  describe("Failure Cases", () => {
    test("Should throw an error if quantity is equal or less than 0", () => {
      try {
        new Quantity(0);
      } catch (error) {
        expect(error).toBeInstanceOf(ModelValidationError);

        if (error instanceof ModelValidationError) {
          expect(error.message).toBe("Quantidade inválida.");
          expect(error.action).toBe("A quantidade deve ser maior que 0.");
        }
      }
    });
  });
});
