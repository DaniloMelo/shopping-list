import { ModelValidationError } from "@/lib/CustomErrors";
import Password from "@/models/Password";

describe("src/models/Password.ts", () => {
  describe("Successfull Cases", () => {
    test("Should return a valid password", () => {
      const password = new Password("P4ssword!23", "P4ssword!23");
      expect(password.getValue()).toBe("P4ssword!23");
    });
  });

  describe("Failure Cases", () => {
    test("Shold throw an error if password is not valid", () => {
      try {
        new Password("invalid-password", "invalid-password");
      } catch (error) {
        expect(error).toBeInstanceOf(ModelValidationError);

        if (error instanceof ModelValidationError) {
          expect(error.message).toBe("Formato de senha inválido.");
          expect(error.action).toBe(
            "A senha deve conter: 8 Caracteres, 1 Letra maiúscula, 1 Número e 1 Caractere especial.",
          );
        }
      }
    });

    test("Should throw an error if the passwords don't match", () => {
      try {
        new Password("P4ssword!23", "P4ssword!234");
      } catch (error) {
        expect(error).toBeInstanceOf(ModelValidationError);

        if (error instanceof ModelValidationError) {
          expect(error.message).toBe("As senhas não são iguais.");
          expect(error.action).toBe("Verifique as senhas informadas.");
        }
      }
    });
  });
});
