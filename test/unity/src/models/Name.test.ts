import { ModelValidationError } from "@/lib/CustomErrors";
import Name from "@/models/Name";

describe("src/models/Name.ts", () => {
  describe("Successfull Cases", () => {
    test("Should return a valid name", () => {
      const name = new Name("John Doe");
      expect(name.getValue()).toEqual("John Doe");
    });
  });

  describe("Failure Cases", () => {
    test("Should throw an error if name lenght is less than 3", () => {
      try {
        new Name("Jo");
      } catch (error) {
        expect(error).toBeInstanceOf(ModelValidationError);

        if (error instanceof ModelValidationError) {
          expect(error.message).toBe("Nome inválido.");
          expect(error.action).toBe("Nome precisa ter 3 ou mais caracteres.");
        }
      }
    });

    test("Should throw an error if name is empty string", () => {
      try {
        new Name("     ");
      } catch (error) {
        expect(error).toBeInstanceOf(ModelValidationError);

        if (error instanceof ModelValidationError) {
          expect(error.message).toBe("Nome inválido.");
          expect(error.action).toBe("Nome não pode ser espaços em branco.");
        }
      }
    });
  });
});
