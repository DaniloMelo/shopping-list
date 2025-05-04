import { ModelValidationError } from "@/lib/CustomErrors";
import Email from "@/models/Email";

describe("src/models/Email.ts", () => {
  describe("Successfull Cases", () => {
    test("Should return a valid email", () => {
      const email = new Email("john@email.com");
      expect(email.getValue()).toBe("john@email.com");
    });
  });

  describe("Failure Cases", () => {
    test("Should throw ModelValidationError if email is not valid", () => {
      try {
        new Email("invalid-email");
      } catch (error) {
        expect(error).toBeInstanceOf(ModelValidationError);

        if (error instanceof ModelValidationError) {
          expect(error.message).toBe("Email inválido.");
          expect(error.action).toBe("Insira um email válido.");
        }
      }
    });
  });
});
