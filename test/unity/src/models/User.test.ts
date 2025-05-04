import Email from "@/models/Email";
import Name from "@/models/Name";
import Password from "@/models/Password";
import User from "@/models/User";

class MockNameClass extends Name {
  constructor() {
    super("John Doe");
  }

  getValue() {
    return "John Doe";
  }
}

class MockEmailClass extends Email {
  constructor() {
    super("john@email.com");
  }

  getValue() {
    return "john@email.com";
  }
}

class MockPasswordClass extends Password {
  constructor() {
    super("P4ssword!23", "P4ssword!23");
  }

  getValue() {
    return "P4ssword!23";
  }
}

describe("src/models/User.ts", () => {
  describe("Successful Cases", () => {
    test("Shold return a new user object", () => {
      const mockNameObj = new MockNameClass();
      const mockEmailObj = new MockEmailClass();
      const mockPasswordObj = new MockPasswordClass();

      const user = new User(mockNameObj, mockEmailObj, mockPasswordObj);
      const newUSer = user.getUser();

      expect(newUSer).toEqual({
        name: "John Doe",
        email: "john@email.com",
        password: "P4ssword!23",
      });
    });
  });
});
