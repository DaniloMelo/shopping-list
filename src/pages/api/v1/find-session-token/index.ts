import Hasher from "@/lib/Hasher";
import TokenService from "@/lib/TokenService";
import AuthRepository from "@/repository/AuthRepository";
import UserRepository from "@/repository/UserRepository";
import AuthService from "@/services/AuthService";
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
    const tokenFromReq = req.headers.cookie;
    const token = tokenFromReq?.split("=")[1];

    const sessionTokenFromDatabase = await authService.findSessionToken(token!);
    res.status(200).json(sessionTokenFromDatabase);
  } catch (error) {
    console.error(error);
  }
}
