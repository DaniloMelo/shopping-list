import { NextApiRequest } from "next";
import TokenService from "./TokenService";

const tokenService = new TokenService();

export default async function getUserIdFromRequest(req: NextApiRequest) {
  const token = req.cookies["sessionToken"];

  if (!token) return null;

  try {
    const decodedJwt = await tokenService.verify(token);

    return decodedJwt.userId as string;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
