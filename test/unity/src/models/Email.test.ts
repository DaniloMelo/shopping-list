import Email from "@/models/Email";

describe("src/models/Email.ts", () => {
  describe("Successfull Cases", () => {
    test("Should return a valid email", () => {
      const e = new Email("john@email.com");

      expect(e.getValue()).toBe("john@email.com");
    });
  });

  describe("Failure Cases", () => {
    test("Should throw an error if email is not valid", () => {
      expect(() => new Email("invalid-email")).toThrow("Email inválido.");
    });
  });
});
