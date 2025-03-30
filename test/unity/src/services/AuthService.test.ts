import { InternalServerError, LoginServiceError, LogoutServiceError } from "@/lib/CustomErrors";
import { IHasher } from "@/lib/Hasher";
import { ITokenService } from "@/lib/TokenService";
import { IAuthRepository } from "@/repository/AuthRepository";
import { IUserRepository } from "@/repository/UserRepository";
import AuthService from "@/services/AuthService";

const mockUserRepository: jest.Mocked<IUserRepository> = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  updatePassword: jest.fn(),
};

const mockAuthRepository: jest.Mocked<IAuthRepository> = {
  createSessionToken: jest.fn(),
  findToken: jest.fn(),
  deleteAllSessionTokens: jest.fn(),
};

const mockHasher: jest.Mocked<IHasher> = {
  encrypt: jest.fn(),
  decrypt: jest.fn(),
};

const mockTokenService: jest.Mocked<ITokenService> = {
  generate: jest.fn(),
  verify: jest.fn(),
};

describe("src/service/AuthService.ts", () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(mockUserRepository, mockAuthRepository, mockHasher, mockTokenService);
  });

  describe("register method:", () => {
    describe("Successfull Cases", () => {
      test("Should create a new user successfully", async () => {
        const user = {
          name: "John Doe",
          email: "john@email.com",
          password: "P4ssword!23",
          passwordConfirmation: "P4ssword!23",
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(null);
        mockHasher.encrypt.mockResolvedValue("hashed-password");
        mockUserRepository.createUser.mockResolvedValue(undefined);

        await expect(authService.register(user)).resolves.toBeUndefined();
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
        expect(mockHasher.encrypt).toHaveBeenCalledWith("P4ssword!23");
        expect(mockUserRepository.createUser).toHaveBeenCalledWith({
          ...user,
          password: "hashed-password",
          passwordConfirmation: undefined,
        });
      });
    });

    describe("Failure Cases", () => {
      test("Should throw an error if user exists", async () => {
        const existingUser = {
          id: "123",
          name: "John Doe",
          email: "john@email.com",
          password: "P4ssword!23",
          createdAt: new Date(Date.now()),
        };

        const newUser = {
          id: "123",
          name: "John Doe",
          email: "john@email.com",
          password: "P4ssword!23",
          passwordConfirmation: "P4ssword!23",
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(existingUser);

        await expect(authService.register(newUser)).rejects.toThrow("Credenciais inválidas");
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
      });

      test("Should throw InternalServerError if unexpected error occurs during register", async () => {
        const newUser = {
          name: "John Doe",
          email: "john@email.com",
          password: "P4ssword!23",
          passwordConfirmation: "P4ssword!23",
        };

        mockUserRepository.findUserByEmail.mockRejectedValue(new Error("Unexpected error."));

        await expect(authService.register(newUser)).rejects.toThrow(InternalServerError);
        await authService.register(newUser).catch((error) => {
          expect(error.message).toBe("Ocorreu um Erro inesperado ao tentar realizar o cadastro.");
        });
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
      });
    });
  });

  describe("login method:", () => {
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
        mockAuthRepository.deleteAllSessionTokens(userData.id);

        const result = await authService.login(userData.email, userData.password);
        expect(result).toBe(sessionToken);
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
        expect(mockHasher.decrypt).toHaveBeenCalledWith("P4ssword!23", "P4ssword!23");
        expect(mockTokenService.generate).toHaveBeenCalledWith({ userId: userData.id });
        expect(mockAuthRepository.deleteAllSessionTokens).toHaveBeenCalledWith("123");
      });
    });

    describe("Failure Cases", () => {
      test("Should throw an error if user don't exist", async () => {
        mockUserRepository.findUserByEmail.mockResolvedValue(null);

        await expect(authService.login("unexistent@email.com", "unexistent")).rejects.toThrow(LoginServiceError);
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("unexistent@email.com");
      });

      test("Should throw an error if password is incorrect", async () => {
        const userData = {
          id: "123",
          name: "John Doe",
          email: "john@email.com",
          password: "P4ssword!23",
          createdAt: new Date(Date.now()),
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(userData);
        mockHasher.decrypt.mockResolvedValue(false);

        await expect(() => authService.login("john@email.com", "wrong-password")).rejects.toThrow(LoginServiceError);
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
        expect(mockHasher.decrypt).toHaveBeenCalledWith("wrong-password", "P4ssword!23");
      });

      test("Should throw InternalServerError if unexpected error occurs during login", async () => {
        mockUserRepository.findUserByEmail.mockRejectedValue(new Error("Unexpected error."));

        await expect(authService.login("john@email.com", "P4ssword!23")).rejects.toThrow(InternalServerError);
        await authService.login("john@email.com", "P4ssword!23").catch((error) => {
          expect(error.message).toBe("Ocorreu um Erro inesperado ao tentar realizar o login.");
        });
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
      });
    });
  });

  describe("logout method", () => {
    describe("Successfull Cases", () => {
      test("Should logout user successfully", async () => {
        const user = {
          id: "123",
          name: "John Doe",
          email: "john@email.com",
          password: "P4ssword!23",
          createdAt: new Date(Date.now()),
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(user);
        mockAuthRepository.deleteAllSessionTokens.mockResolvedValue(undefined);

        await expect(authService.logout("john@email.com")).resolves.toBeUndefined();
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
        expect(mockAuthRepository.deleteAllSessionTokens).toHaveBeenCalledWith("123");
      });
    });

    describe("Failure Cases", () => {
      test("Should throw an error if user don't exist", async () => {
        mockUserRepository.findUserByEmail.mockResolvedValue(null);

        await expect(authService.logout("john@email.com")).rejects.toThrow(LogoutServiceError);
        await authService.logout("john@email.com").catch((error) => {
          expect(error.message).toBe("User not found.");
        });
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
      });

      test("Should throw InternalServerError if unexpected error occurs during logout", async () => {
        mockUserRepository.findUserByEmail.mockRejectedValue(new Error("Unexpected error"));

        await expect(authService.logout("john@email.com")).rejects.toThrow(InternalServerError);
        await authService.logout("john@email.com").catch((error) => {
          expect(error.message).toBe("Ocorreu um Erro inesperado ao tentar realizar o logout.");
        });
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
      });
    });
  });
});
