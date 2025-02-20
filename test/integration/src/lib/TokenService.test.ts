import { TokenServiceError } from "@/lib/CustomErrors";
import TokenService from "@/lib/TokenService";

describe("src/lib/TokenService.ts", () => {
  const originalJWTSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = "mysecretkey";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalJWTSecret;
  });

  describe("Successfull Cases", () => {
    test("Should create new token", async () => {
      const tokenService = new TokenService();

      const payloadObj = { userId: "123" };

      const payloadResult = await tokenService.generate(payloadObj);

      expect(payloadResult).not.toBeNull();
      expect(payloadResult).not.toBeUndefined();
      expect(typeof payloadResult).toBe("string");
    });

    test("Should verify a valid token", async () => {
      const tokenService = new TokenService();

      const payload = { userId: "123" };

      const payloadResult = await tokenService.generate(payload);

      const verifiedPayload = await tokenService.verify(payloadResult);

      expect(verifiedPayload.userId).toEqual("123");
    });
  });

  describe("Failure Cases", () => {
    test("Should throw an Error if JWT_SECRET environment variable is not defined", () => {
      const currentSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      expect(() => new TokenService()).toThrow(TokenServiceError);

      process.env.JWT_SECRET = currentSecret;
    });

    test("Should throw an error when checking for an invalid token", async () => {
      const tokenService = new TokenService();

      await expect(() => tokenService.verify("invalid_token")).rejects.toThrow("Invalid Token.");
    });
  });
});
