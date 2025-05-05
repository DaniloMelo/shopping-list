import { ModelValidationError } from "@/lib/CustomErrors";

export default class Password {
  private readonly password: string;

  constructor(password: string, passwordConfirmation: string) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new ModelValidationError(
        "Formato de senha inválido.",
        "A senha deve conter: 8 Caracteres, 1 Letra maiúscula, 1 Número e 1 Caractere especial.",
        400,
        true,
        "A senha não segue o seguinte formato: 8 Caracteres, 1 Letra maiúscula, 1 Número e 1 Caractere especial.",
      );
    }

    if (password !== passwordConfirmation) {
      throw new ModelValidationError(
        "As senhas não são iguais.",
        "Verifique as senhas informadas.",
        400,
        true,
        "As senhas não são iguais.",
      );
    }

    this.password = password;
  }

  getValue() {
    return this.password;
  }
}
