import { ModelValidationError } from "@/lib/CustomErrors";

export default class Email {
  private readonly email: string;

  constructor(email: string) {
    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    if (!emailRegex.test(email)) {
      throw new ModelValidationError(
        "Email inválido.",
        "Insira um email válido.",
        400,
        true,
        "Formato de email inválido.",
      );
    }

    this.email = email;
  }

  getValue() {
    return this.email;
  }
}
