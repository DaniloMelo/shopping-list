import { prisma } from "@/lib/prisma";
import UserRepository, { IUserRepository, IDbUser, INewUser } from "@/repository/UserRepository";

jest.mock("../../../../src/lib/prisma", () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("src/repository/UserRepository.ts", () => {
  let userRepository: IUserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  describe("Successful Cases", () => {
    test("Should create an unser", async () => {
      const userObj: INewUser = {
        name: "John Doe",
        email: "john@email.com",
        password: "hashed-password",
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(null);

      await userRepository.createUser(userObj);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { ...userObj, email: userObj.email.toLowerCase() },
      });
    });

    test("Should return an user by email", async () => {
      const userEmail = "john@email.com";
      const userData: IDbUser = {
        id: "123",
        name: "John Doe",
        email: "john@email.com",
        password: "hashed-password",
        createdAt: new Date(Date.now()),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userData);

      await userRepository.findUserByEmail(userEmail);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userEmail },
      });
    });

    test("Should return an user by ID", async () => {
      const userId = "123";
      const userData: IDbUser = {
        id: "123",
        name: "John Doe",
        email: "john@email.com",
        password: "hashed-password",
        createdAt: new Date(Date.now()),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userData);

      await userRepository.findUserById(userId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    test("Shold update an user password", async () => {
      const userId = "123";
      const newUserPassword = "new-hashed-password";

      (prisma.user.update as jest.Mock).mockResolvedValue(null);

      await userRepository.updatePassword(userId, newUserPassword);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { password: newUserPassword },
      });
    });
  });

  describe("Failure Cases", () => {
    test("Should return null if user email don't exists", async () => {
      const nonExistentEmail = "nonExistentEmail@email.com";

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await userRepository.findUserByEmail(nonExistentEmail);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: nonExistentEmail.toLowerCase() },
      });
    });

    test("Should return null if user ID don't exist", async () => {
      const nonExistentUserId = "321";

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await userRepository.findUserById(nonExistentUserId);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: nonExistentUserId },
      });
    });
  });
});
