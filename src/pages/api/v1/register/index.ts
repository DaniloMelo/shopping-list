import UserRepository from "@/repository/UserRepository";
import Hasher from "@/lib/Hasher";
import { NextApiRequest, NextApiResponse } from "next";
// import RegisterService from "@/services/auth/RegisterService";
import { InternalServerError, RegisterServiceError, UserValidationsError } from "@/lib/CustomErrors";
import AuthService from "@/services/AuthService";
import AuthRepository from "@/repository/AuthRepository";
import TokenService from "@/lib/TokenService";

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const hasher = new Hasher();
const tokenService = new TokenService();
// const registerService = new RegisterService(userRepository, hasher);

const authService = new AuthService(userRepository, authRepository, hasher, tokenService);

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed." });
  }

  try {
    const { name, email, password, passwordConfirmation } = req.body;

    await authService.register({ name, email, password, passwordConfirmation });

    return res.status(201).json({ message: "User Created." });
  } catch (error) {
    if (
      error instanceof UserValidationsError ||
      error instanceof RegisterServiceError ||
      error instanceof InternalServerError
    ) {
      return res
        .status(error.statusCode)
        .json({ message: error.message, action: error.action, isPublicError: error.isPublicError });
    }
  }
}
