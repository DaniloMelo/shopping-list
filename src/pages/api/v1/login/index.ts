import { InternalServerError, LoginServiceError, TokenServiceError } from "@/lib/CustomErrors";
import Hasher from "@/lib/Hasher";
import TokenService from "@/lib/TokenService";
import AuthRepository from "@/repository/AuthRepository";
import UserRepository from "@/repository/UserRepository";
import AuthService from "@/services/AuthService";
import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const hasher = new Hasher();
const tokenService = new TokenService();
const authService = new AuthService(userRepository, authRepository, hasher, tokenService);

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(403).json({ message: "Method Not Allowed." });
  }

  try {
    const { email, password } = req.body;

    const sessionToken = await authService.login(email, password);

    const isProduction = process.env.NODE_ENV === "production";

    setCookie("sessionToken", sessionToken, {
      req,
      res,
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });

    console.log("Cookie setado: ====>", res.getHeader("Set-Cookie"));

    return res.status(200).json({ message: "Login Successfull." });
  } catch (error) {
    if (
      error instanceof LoginServiceError ||
      error instanceof TokenServiceError ||
      error instanceof InternalServerError
    ) {
      return res
        .status(error.statusCode)
        .json({ message: error.message, action: error.action, isPublicError: error.isPublicError });
    }
  }
}
