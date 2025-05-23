import { InternalServerError, ResetPasswordServiceError } from "@/lib/CustomErrors";
import { IHasher } from "@/lib/Hasher";
import { IMailer } from "@/lib/Mailer";
import { ITokenService } from "@/lib/TokenService";
import { IResetPasswordRepository } from "@/repository/ResetPasswordRepository";
import { IUserRepository } from "@/repository/UserRepository";
import ResetPasswordService from "@/services/ResetPasswordService";

const mockUserRepository: jest.Mocked<IUserRepository> = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  updatePassword: jest.fn(),
};

const mockResetPasswordRepository: jest.Mocked<IResetPasswordRepository> = {
  createResetPasswordToken: jest.fn(),
  findResetPasswordToken: jest.fn(),
  deleteAllResetPasswordTokens: jest.fn(),
};

const mockTokenService: jest.Mocked<ITokenService> = {
  generate: jest.fn(),
  verify: jest.fn(),
};

const mockHasher: jest.Mocked<IHasher> = {
  encrypt: jest.fn(),
  decrypt: jest.fn(),
};

const mockMailer: jest.Mocked<IMailer> = {
  send: jest.fn(),
};

describe("src/services/ResetPasswordService.ts", () => {
  let resetPasswordService: ResetPasswordService;

  beforeEach(() => {
    jest.clearAllMocks();
    resetPasswordService = new ResetPasswordService(
      mockUserRepository,
      mockResetPasswordRepository,
      mockTokenService,
      mockHasher,
      mockMailer,
    );
  });

  describe("requestResetPassword method", () => {
    describe("Successfull Cases", () => {
      test("Should call requestResetPassword method and send an email", async () => {
        const dbUser = {
          id: "123",
          name: "John Doe",
          email: "john@email.com",
          password: "hashed-password",
          createdAt: new Date(),
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(dbUser);
        mockResetPasswordRepository.findResetPasswordToken.mockResolvedValue(null);
        mockTokenService.generate.mockResolvedValue("fake-test-token");
        mockResetPasswordRepository.createResetPasswordToken.mockResolvedValue(undefined);
        mockMailer.send.mockResolvedValue(undefined);

        await resetPasswordService.requestResetPassword("john@email.com");

        expect(mockTokenService.generate).toHaveBeenCalled();
        expect(mockHasher.encrypt).toHaveBeenCalledWith("fake-test-token");
        expect(mockResetPasswordRepository.createResetPasswordToken).toHaveBeenCalled();
        expect(mockMailer.send).toHaveBeenCalled();
      });
    });

    describe("Failure Cases", () => {
      test("Should throw an error if user don't exist", async () => {
        mockUserRepository.findUserByEmail.mockResolvedValue(null);

        await expect(resetPasswordService.requestResetPassword("john@email.com")).rejects.toThrow(
          ResetPasswordServiceError,
        );

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");

        await resetPasswordService.requestResetPassword("john@email.com").catch((error) => {
          expect(error.message).toBe("Usuário não encontrado.");
          expect(error.action).toBe("Verifique suas credenciais.");
        });
      });

      test("Should throw an error if some reset password token already exists", async () => {
        const dbUser = {
          id: "123",
          name: "John Doe",
          email: "john@email.com",
          password: "hashed-password",
          createdAt: new Date(),
        };

        const dbResetPasswordToken = {
          id: "456",
          token: "fake-test-token",
          userId: "123",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          createdAt: new Date(),
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(dbUser);
        mockResetPasswordRepository.findResetPasswordToken.mockResolvedValue(dbResetPasswordToken);

        await expect(resetPasswordService.requestResetPassword("john@email.com")).rejects.toThrow(
          ResetPasswordServiceError,
        );

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
        expect(mockResetPasswordRepository.findResetPasswordToken).toHaveBeenCalledWith("123");

        await resetPasswordService.requestResetPassword("john@email.com").catch((error) => {
          expect(error.message).toBe("Email já Enviado.");
          expect(error.action).toBe("Verifique sua caixa de entrada.");
        });
      });

      test("Should throw InternalServerError if unexpected error occurs during reset password request", async () => {
        mockUserRepository.findUserByEmail.mockRejectedValue(new Error("Unexpected error"));

        await expect(resetPasswordService.requestResetPassword("john@email.com")).rejects.toThrow(InternalServerError);

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");

        await resetPasswordService.requestResetPassword("john@email.com").catch((error) => {
          expect(error.message).toBe("Ocorreu um erro inesperado ao tentar solicitar a redefinição da senha.");
          expect(error.action).toBe("Tente novamente mais tarde.");
        });
      });
    });
  });

  describe("executeResetPassword method", () => {
    describe("Successfull Cases", () => {
      test("Should call executeResetPassword method and reset password properly", async () => {
        const dbUser = {
          id: "123",
          name: "John Doe",
          email: "john@email.com",
          password: "hashed-password",
          createdAt: new Date(),
        };

        const dbResetPasswordToken = {
          id: "456",
          token: "hashed-fake-token",
          userId: "123",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          createdAt: new Date(),
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(dbUser);
        mockResetPasswordRepository.findResetPasswordToken.mockResolvedValue(dbResetPasswordToken);
        mockHasher.decrypt.mockResolvedValue(true);
        mockHasher.encrypt.mockResolvedValue("new-hashed-password");
        mockUserRepository.updatePassword.mockResolvedValue();
        mockResetPasswordRepository.deleteAllResetPasswordTokens.mockResolvedValue();

        await resetPasswordService.executeResetPassword("john@email.com", "fake-token", "P4ssword!234", "P4ssword!234");
        expect(mockHasher.decrypt).toHaveBeenCalledWith("fake-token", "hashed-fake-token");
        expect(mockHasher.encrypt).toHaveBeenCalledWith("P4ssword!234");
        expect(mockUserRepository.updatePassword).toHaveBeenCalledWith("123", "new-hashed-password");
        expect(mockResetPasswordRepository.deleteAllResetPasswordTokens).toHaveBeenCalledWith("123");
      });
    });

    describe("Failure Cases", () => {
      test("Should throw an error if user don't exist", async () => {
        mockUserRepository.findUserByEmail.mockResolvedValue(null);

        await expect(
          resetPasswordService.executeResetPassword("john@email.com", "fake-token", "P4ssword!234", "P4ssword!234"),
        ).rejects.toThrow(ResetPasswordServiceError);

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");

        await resetPasswordService
          .executeResetPassword("john@email.com", "fake-token", "P4ssword!234", "P4ssword!234")
          .catch((error) => {
            expect(error.message).toBe("Usuário não encontrado");
            expect(error.action).toBe("Verifique suas credenciais.");
          });
      });

      test("Should throw an error if token don't exist", async () => {
        const dbUser = {
          id: "123",
          name: "John Doe",
          email: "john@email.com",
          password: "hashed-password",
          createdAt: new Date(),
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(dbUser);
        mockResetPasswordRepository.findResetPasswordToken.mockResolvedValue(null);

        await expect(
          resetPasswordService.executeResetPassword("john@email.com", "fake-token", "P4ssword!234", "P4ssword!234"),
        ).rejects.toThrow(ResetPasswordServiceError);

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");

        await resetPasswordService
          .executeResetPassword("john@email.com", "fake-token", "P4ssword!234", "P4ssword!234")
          .catch((error) => {
            expect(error.message).toBe("Não foi possível redefinir sua senha.");
            expect(error.action).toBe("Faça uma nova solicitação.");
          });
      });

      test("Should throw an error when the token has expired", async () => {
        const dbUser = {
          id: "123",
          name: "John Doe",
          email: "john@email.com",
          password: "hashed-password",
          createdAt: new Date(),
        };

        const dbResetPasswordToken = {
          id: "456",
          token: "hashed-fake-token",
          userId: "123",
          expiresAt: new Date(Date.now() - 10 * 60 * 1000),
          createdAt: new Date(),
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(dbUser);
        mockResetPasswordRepository.findResetPasswordToken.mockResolvedValue(dbResetPasswordToken);
        mockHasher.decrypt.mockResolvedValue(true);

        await expect(
          resetPasswordService.executeResetPassword("john@email.com", "fake-token", "P4ssword!234", "P4ssword!234"),
        ).rejects.toThrow(ResetPasswordServiceError);

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");
        expect(mockResetPasswordRepository.findResetPasswordToken).toHaveBeenCalledWith("123");
        expect(mockHasher.decrypt).toHaveBeenCalledWith("fake-token", "hashed-fake-token");

        await resetPasswordService
          .executeResetPassword("john@email.com", "fake-token", "P4ssword!234", "P4ssword!234")
          .catch((error) => {
            expect(error.message).toBe("Não foi possível redefinir sua senha.");
            expect(error.action).toBe("Faça uma nova solicitação.");
          });
      });

      test("Should throw InternalServerError if unexpected error occurs during reset password execution", async () => {
        mockUserRepository.findUserByEmail.mockRejectedValue(new Error("Unexpected error"));

        await expect(
          resetPasswordService.executeResetPassword("john@email.com", "fake-token", "P4ssword!234", "P4ssword!234"),
        ).rejects.toThrow(InternalServerError);

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("john@email.com");

        await resetPasswordService
          .executeResetPassword("john@email.com", "fake-token", "P4ssword!234", "P4ssword!234")
          .catch((error) => {
            expect(error.message).toBe("Ocorreu um erro inesperado ao tentar resetar a senha");
            expect(error.action).toBe("Tente novamente mais tarde");
          });
      });
    });
  });
});
