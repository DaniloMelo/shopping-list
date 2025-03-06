import { UserServiceError } from "@/lib/CustomErrors";
import UserRepository from "@/repository/UserRepository";
import UserService from "@/services/UserService";
import { NextApiRequest, NextApiResponse } from "next";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export default async function findUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "User ID is required." });

    const user = await userService.findUserById(id as string);
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Internal Error in find-user endpoint: ", error);

    if (error instanceof UserServiceError) {
      return res.status(error.statusCode).json(error);
    }
  }
}
