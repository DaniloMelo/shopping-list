import { UserServiceError } from "@/lib/CustomErrors";
import { IUserRepository } from "@/repository/UserRepository";
import UserService from "@/services/UserService";

const mockUserRepository: jest.Mocked<IUserRepository> = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  updatePassword: jest.fn(),
};

describe("src/services/UserService.ts", () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(mockUserRepository);
  });

  describe("findUserById method: ", () => {
    describe("Successfull Cases", () => {
      test("Shold find user by id", async () => {
        const user = {
          id: "123",
          name: "John Doe",
          email: "john@email.com",
          password: "P4ssword!23",
          createdAt: new Date(Date.now()),
        };

        mockUserRepository.findUserById.mockResolvedValue(user);

        const result = await userService.findUserById("123");

        expect(result).toBe(user);
      });
    });

    describe("Failure Cases", () => {
      test("Shold throw an error if user don't exist", async () => {
        mockUserRepository.findUserById.mockResolvedValue(null);

        await expect(userService.findUserById("321")).rejects.toThrow(UserServiceError);
      });
    });
  });
});
