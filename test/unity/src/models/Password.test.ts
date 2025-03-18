import Password from "@/models/Password";

describe("src/models/Password.ts", () => {
  describe("Successfull Cases", () => {
    test("Should return a valid password", () => {
      const p = new Password("P4ssword!23", "P4ssword!23");
      expect(p.getValue()).toBe("P4ssword!23");
    });
  });

  describe("Failure Cases", () => {
    test("Shold throw an error if password is not valid", () => {
      expect(() => new Password("invalid-password", "invalid-password")).toThrow("Formato de senha inválida.");
    });

    test("Should throw an error if the passwords don't match", () => {
      expect(() => new Password("P4ssword!23", "P4ssword!234")).toThrow("As senhas não são iguais.");
    });
  });
});
