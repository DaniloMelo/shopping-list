import { InternalServerError, ProductServiceError } from "@/lib/CustomErrors";
import ShoppingListRepository from "@/repository/ShoppingListRepository";
import UserRepository from "@/repository/UserRepository";
import ShoppingListService from "@/services/ShoppingListService";
import { NextApiRequest, NextApiResponse } from "next";

const userRepository = new UserRepository();
const shoppingListRepository = new ShoppingListRepository();
const shoppingListService = new ShoppingListService(userRepository, shoppingListRepository);

export default async function deleteProduct(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const { productId } = req.query;
    const { userId } = req.body;

    await shoppingListService.deleteProduct(productId as string, userId);

    return res.status(200).json({ message: "Product deleted." });
  } catch (error) {
    if (error instanceof ProductServiceError || error instanceof InternalServerError) {
      return res
        .status(error.statusCode)
        .json({ message: error.message, action: error.action, isPublicError: error.isPublicError });
    }
  }
}
