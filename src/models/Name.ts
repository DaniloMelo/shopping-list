import { ModelValidationError } from "@/lib/CustomErrors";

export default class Name {
  private readonly name: string;

  constructor(name: string) {
    if (name.length < 3) {
      throw new ModelValidationError("Nome inválido.", "Nome precisa ter 3 ou mais caracteres.", 400, true);
    }

    if (name.trim().length === 0) {
      throw new ModelValidationError("Nome inválido.", "Nome não pode ser espaços em branco.", 400, true);
    }

    this.name = name;
  }

  getValue() {
    return this.name;
  }
}
