import Hasher from "@/lib/Hasher";
import TokenService from "@/lib/TokenService";
import AuthRepository from "@/repository/AuthRepository";
import UserRepository from "@/repository/UserRepository";
import AuthService from "@/services/AuthService";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const hasher = new Hasher();
const tokenService = new TokenService();
const authService = new AuthService(userRepository, authRepository, hasher, tokenService);

export default async function findSessionToken(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Internal Server Error" });
  }

  try {
    const token = getCookie("sessionToken", { req, res }) as string;

    if (!token) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const sessionTokenFromDatabase = await authService.findSessionToken(token!);

    if (!sessionTokenFromDatabase) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }

    res.status(200).json(sessionTokenFromDatabase);
  } catch (error) {
    console.error("Error on find-session-token endpoint", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
