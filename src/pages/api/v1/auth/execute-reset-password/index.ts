import { InternalServerError, ModelValidationError, ResetPasswordServiceError } from "@/lib/CustomErrors";
import Hasher from "@/lib/Hasher";
import Mailer from "@/lib/Mailer";
import TokenService from "@/lib/TokenService";
import ResetPasswordRepository from "@/repository/ResetPasswordRepository";
import UserRepository from "@/repository/UserRepository";
import ResetPasswordService from "@/services/ResetPasswordService";
import { NextApiRequest, NextApiResponse } from "next";

const userRepository = new UserRepository();
const resetPasswordRepository = new ResetPasswordRepository();
const tokenService = new TokenService();
const hasher = new Hasher();
const mailer = new Mailer();
const resetPasswordService = new ResetPasswordService(
  userRepository,
  resetPasswordRepository,
  tokenService,
  hasher,
  mailer,
);

export default async function ExecuteResetPassword(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed." });
  }

  try {
    const { email, token, password, passwordConfirmation } = req.body;

    await resetPasswordService.executeResetPassword(email, token, password, passwordConfirmation);

    return res.status(200).json({ message: "New password has been created." });
  } catch (error) {
    if (
      error instanceof ResetPasswordServiceError ||
      error instanceof InternalServerError ||
      error instanceof ModelValidationError
    ) {
      return res
        .status(error.statusCode)
        .json({ message: error.message, action: error.action, isPublicError: error.isPublicError });
    }
  }
}
