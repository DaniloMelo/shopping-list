import User from "@/models/User";

describe("src/models/User.ts", () => {
  describe("Successful Cases", () => {
    test("Shold return a new user object", () => {
      const user = new User("John Doe", "john@email.com", "P4ssword!23", "P4ssword!23");

      expect(user.getUser()).toEqual({
        name: "John Doe",
        email: "john@email.com",
        password: "P4ssword!23",
      });
    });
  });

  describe("Failure Cases", () => {
    test("Shold return an error when name is not valid", () => {
      const user = new User(" ", "john@email.com", "P4ssword!23", "P4ssword!23");

      expect(() => user.getUser()).toThrow("Nome inválido.");
    });

    test("Should return an error when email is not valid", () => {
      const user = new User("John Doe", "invalid-email", "P4ssword!23", "P4ssword!23");

      expect(() => user.getUser()).toThrow("Email inválido.");
    });

    test("Shold return an error when password is not valid", () => {
      const user = new User("John Doe", "john@email.com", "invalid-password", "invalid-password");

      expect(() => user.getUser()).toThrow("Formato de senha inválida.");
    });

    test("Should return an error when passwords not match", () => {
      const user = new User("John Doe", "john@email.com", "P4ssword!23", "P4ssword!24");

      expect(() => user.getUser()).toThrow("As senhas não são iguais.");
    });
  });
});
