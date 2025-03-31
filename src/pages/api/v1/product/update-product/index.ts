import { InternalServerError, ModelValidationError, ProductServiceError } from "@/lib/CustomErrors";
import ShoppingListRepository from "@/repository/ShoppingListRepository";
import UserRepository from "@/repository/UserRepository";
import ShoppingListService from "@/services/ShoppingListService";

import { NextApiRequest, NextApiResponse } from "next";

const userRepository = new UserRepository();
const shoppingListRepository = new ShoppingListRepository();
const shoppingListService = new ShoppingListService(userRepository, shoppingListRepository);

export default async function updateProduct(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userId, productId, productName, productPrice, productQuantity } = req.body;

    await shoppingListService.updateProduct(userId, productId, { productName, productPrice, productQuantity });

    return res.status(200).json({ message: "Product updated." });
  } catch (error) {
    if (
      error instanceof ModelValidationError ||
      error instanceof ProductServiceError ||
      error instanceof InternalServerError
    ) {
      return res
        .status(error.statusCode)
        .json({ message: error.message, action: error.action, isPublicError: error.isPublicError });
    }

    console.error("Unexpected error in update-product endpoint: ", error);
  }
}
