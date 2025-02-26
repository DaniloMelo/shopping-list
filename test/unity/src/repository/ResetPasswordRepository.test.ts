import { prisma } from "@/lib/prisma";
import ResetPasswordRepository, {
  IDbResetPasswordToken,
  IResetPasswordRepository,
  IResetPasswordTokenObj,
} from "@/repository/ResetPasswordRepository";

jest.mock("../../../../src/lib/prisma", () => ({
  prisma: {
    resetPasswordToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

describe("src/repository/ResetPasswordRepository.ts", () => {
  let resetPasswordRepository: IResetPasswordRepository;

  beforeEach(() => {
    resetPasswordRepository = new ResetPasswordRepository();
  });

  describe("Successfull Cases", () => {
    test("Should Create a new reset password token", async () => {
      const newResetPasswordTokenObj: IResetPasswordTokenObj = {
        token: "fake-test-token",
        userId: "123",
        expiresAt: new Date(Date.now() + 10 * 60 * 60),
      };

      (prisma.resetPasswordToken.create as jest.Mock).mockResolvedValue(null);

      await resetPasswordRepository.createResetPasswordToken(newResetPasswordTokenObj);

      expect(prisma.resetPasswordToken.create).toHaveBeenCalledWith({
        data: newResetPasswordTokenObj,
      });
    });

    test("Should find a reset password token by user id", async () => {
      const dbResetPasswordTokoen: IDbResetPasswordToken = {
        id: "456",
        token: "fake-test-token",
        userId: "123",
        expiresAt: new Date(),
        createdAt: new Date(),
      };

      (prisma.resetPasswordToken.findFirst as jest.Mock).mockResolvedValue(dbResetPasswordTokoen);

      await resetPasswordRepository.findResetPasswordToken("123");

      expect(prisma.resetPasswordToken.findFirst).toHaveBeenCalledWith({
        where: { userId: "123" },
      });
    });

    test("Should delete all reset password tokens by user id", async () => {
      (prisma.resetPasswordToken.deleteMany as jest.Mock).mockResolvedValue(null);

      await resetPasswordRepository.deleteAllResetPasswordTokens("123");

      expect(prisma.resetPasswordToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: "123" },
      });
    });
  });

  describe("Failure Cases", () => {
    test("Should return null when trying to find a token that doesn't exist", async () => {
      const userId = "unexistent-id";

      (prisma.resetPasswordToken.findFirst as jest.Mock).mockResolvedValue(null);

      await resetPasswordRepository.findResetPasswordToken(userId);

      expect(prisma.resetPasswordToken.findFirst).toHaveBeenCalledWith({
        where: { userId: userId },
      });
    });

    test("Should return null when trying to delete a token that doesn't exist", async () => {
      const userId = "unexistent-id";

      (prisma.resetPasswordToken.deleteMany as jest.Mock).mockResolvedValue(null);

      await resetPasswordRepository.deleteAllResetPasswordTokens(userId);

      expect(prisma.resetPasswordToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: userId },
      });
    });
  });
});
