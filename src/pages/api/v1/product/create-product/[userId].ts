import { InternalServerError, ModelValidationError } from "@/lib/CustomErrors";
import ShoppingListRepository from "@/repository/ShoppingListRepository";
import UserRepository from "@/repository/UserRepository";
import ShoppingListService from "@/services/ShoppingListService";
import { NextApiRequest, NextApiResponse } from "next";

const userRepository = new UserRepository();
const shoppingListRepository = new ShoppingListRepository();
const shoppingListService = new ShoppingListService(userRepository, shoppingListRepository);

export default async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed." });
  }

  try {
    const { productName, productPrice, productQuantity } = req.body;
    const { userId } = req.query;

    await shoppingListService.createProduct({ productName, productPrice, productQuantity, userId: userId as string });

    return res.status(201).json({ message: "Product created." });
  } catch (error) {
    if (error instanceof ModelValidationError || error instanceof InternalServerError) {
      return res
        .status(error.statusCode)
        .json({ message: error.message, action: error.action, isPublicError: error.isPublicError });
    }
  }
}
