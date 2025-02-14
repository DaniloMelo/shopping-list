import { IHasher } from "@/lib/Hasher";
import { IUserRepository } from "@/repository/UserRepository";
import RegisterService from "@/services/auth/RegisterService";

const mockUserRepository: jest.Mocked<IUserRepository> = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  updatePassword: jest.fn(),
};

const mockHasher: jest.Mocked<IHasher> = {
  encrypt: jest.fn(),
  decrypt: jest.fn(),
};

describe("scr/service/RegisterService.ts", () => {
  let registerService: RegisterService;

  beforeEach(() => {
    jest.clearAllMocks();
    registerService = new RegisterService(mockUserRepository, mockHasher);
  });

  describe("Successful Cases", () => {
    test("Should create a new user successfully", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockHasher.encrypt.mockResolvedValue("hashed-password");
      mockUserRepository.createUser.mockRejectedValue(undefined);

      const response = await registerService.register({
        name: "John Doe",
        email: "john@email.com",
        password: "P4ssword!23",
        passwordConfirmation: "P4ssword!23",
      });

      expect(response).toBeUndefined();
    });
  });

  // describe("Failure Cases", () => {
  //   test("Should throw an error if user exists", async () => {
  //     const user = {
  //       name: "John Doe",
  //       email: "john@email.com",
  //       password: "P4ssword!23"
  //     };

  //     (mockUserRepository.findUserByEmail as jest.Mock).mockResolvedValue(user)

  //     await ...
  //   })
  // });
});
