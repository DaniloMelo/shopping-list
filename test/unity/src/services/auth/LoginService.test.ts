import { LoginServiceError } from "@/lib/CustomErrors";
import { IHasher } from "@/lib/Hasher";
import { ITokenService } from "@/lib/TokenService";
import { IAuthRepository } from "@/repository/AuthRepository";
import { IUserRepository } from "@/repository/UserRepository";
import { LoginService } from "@/services/auth/LoginService";

const mockUserRepository: jest.Mocked<IUserRepository> = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  updatePassword: jest.fn(),
};

const mockAuthRepository: jest.Mocked<IAuthRepository> = {
  createSessionToken: jest.fn(),
  findToken: jest.fn(),
  deleteAllTokens: jest.fn(),
};

const mockHasher: jest.Mocked<IHasher> = {
  encrypt: jest.fn(),
  decrypt: jest.fn(),
};

const mockTokenService: jest.Mocked<ITokenService> = {
  generate: jest.fn(),
  verify: jest.fn(),
};

describe("src/services/auth/LoginService.ts", () => {
  let loginService: LoginService;

  beforeEach(() => {
    jest.clearAllMocks();
    loginService = new LoginService(mockUserRepository, mockAuthRepository, mockHasher, mockTokenService);
  });

  describe("Successfull Cases", () => {
    test("Should return a session token when user succesfull logged in", async () => {
      const userData = {
        id: "123",
        name: "John Doe",
        email: "john@email.com",
        password: "P4ssword!23",
        createdAt: new Date(Date.now()),
      };

      const sessionToken = "fake-token";

      mockUserRepository.findUserByEmail.mockResolvedValue(userData);
      mockHasher.decrypt.mockResolvedValue(true);
      mockTokenService.generate.mockResolvedValue(sessionToken);

      const result = await loginService.login(userData.email, userData.password);
      expect(result).toBe(sessionToken);
    });
  });

  describe("Failure Cases", () => {
    test("Should throw an error if user don't exist", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);

      await expect(loginService.login("unexistent@email.com", "unexistent")).rejects.toThrow(LoginServiceError);
    });

    test("Shold throw an error if password is incorrect", async () => {
      const userData = {
        id: "123",
        name: "John Doe",
        email: "john@email.com",
        password: "P4ssword!23",
        createdAt: new Date(Date.now()),
      };

      mockUserRepository.findUserByEmail.mockResolvedValue(userData);
      mockHasher.decrypt.mockResolvedValue(false);

      await expect(() => loginService.login("john@email.com", "wrong-password")).rejects.toThrow(LoginServiceError);
    });
  });
});
