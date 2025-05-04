import Name from "@/models/Name";

describe("src/models/Name.ts", () => {
  describe("Successfull Cases", () => {
    test("Should return a valid name", () => {
      const n = new Name("John Doe");
      expect(n.getValue()).toEqual("John Doe");
    });
  });

  describe("Failure Cases", () => {
    test("Should throw an error if name lenght is less than 3", () => {
      expect(() => new Name("Jo")).toThrow("Nome inválido.");
    });

    test("Should throw an error if name is empty string", () => {
      expect(() => new Name("")).toThrow("Nome inválido.");
      expect(() => new Name("   ")).toThrow("Nome inválido.");
    });
  });
});
