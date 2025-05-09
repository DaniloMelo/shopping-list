import { InternalServerError, ModelValidationError } from "@/lib/CustomErrors";
import getUserIdFromRequest from "@/lib/getUserIdFromRequest";
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

  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { productName, productPrice, productQuantity } = req.body;

    await shoppingListService.createProduct({ productName, productPrice, productQuantity, userId });

    return res.status(201).json({ message: "Product created." });
  } catch (error) {
    if (error instanceof ModelValidationError || error instanceof InternalServerError) {
      return res
        .status(error.statusCode)
        .json({ message: error.message, action: error.action, isPublicError: error.isPublicError });
    }
  }
}
