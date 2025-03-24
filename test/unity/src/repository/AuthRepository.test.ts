import { prisma } from "@/lib/prisma";
import AuthRepository, { IAuthRepository, ITokenObj } from "@/repository/AuthRepository";

jest.mock("../../../../src/lib/prisma", () => ({
  prisma: {
    sessionToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

describe("src/repository/AuthRepository.ts", () => {
  let authRepository: IAuthRepository;

  beforeEach(() => {
    authRepository = new AuthRepository();
  });

  describe("Successfull Cases", () => {
    test("Should login user and create a session token", async () => {
      const newTokenObj: ITokenObj = {
        token: "xqzcavRfmlubjl1OQpHVMHt6wQYdzIODX8mpeTvToGTQQOfZs5jAd0sJxyGI38S2",
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      };

      (prisma.sessionToken.create as jest.Mock).mockResolvedValue(null);

      await authRepository.createSessionToken(newTokenObj);

      expect(prisma.sessionToken.create).toHaveBeenCalledWith({
        data: newTokenObj,
      });
    });

    test("Should find and return a token", async () => {
      const tokenToFind = "xqzcavRfmlubjl1OQpHVMHt6wQYdzIODX8mpeTvToGTQQOfZs5jAd0sJxyGI38S2";

      const tokenObj: ITokenObj = {
        token: "xqzcavRfmlubjl1OQpHVMHt6wQYdzIODX8mpeTvToGTQQOfZs5jAd0sJxyGI38S2",
        userId: "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      };

      (prisma.sessionToken.findFirst as jest.Mock).mockResolvedValue(tokenObj);

      await authRepository.findToken(tokenToFind);

      expect(prisma.sessionToken.findFirst).toHaveBeenCalledWith({
        where: { token: tokenToFind },
      });
    });

    test("Shold delete all user session tokens", async () => {
      const userId = "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8";

      (prisma.sessionToken.deleteMany as jest.Mock).mockResolvedValue(null);

      await authRepository.deleteAllSessionTokens(userId);

      expect(prisma.sessionToken.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe("Failure Cases", () => {
    test("Should return null when trying to find a token that doesn't exist", async () => {
      const tokenToFind = "unexistent-token";

      (prisma.sessionToken.findFirst as jest.Mock).mockResolvedValue(null);

      await authRepository.findToken(tokenToFind);

      expect(prisma.sessionToken.findFirst).toHaveBeenCalledWith({
        where: { token: tokenToFind },
      });
    });

    test("Should return null when trying to delete a token that doesn't exist", async () => {
      const userId = "e1668919-8c2d-4e6c-9b59-72b6c83cb8f8";

      (prisma.sessionToken.deleteMany as jest.Mock).mockResolvedValue(null);

      await authRepository.deleteAllSessionTokens(userId);

      expect(prisma.sessionToken.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });
});
