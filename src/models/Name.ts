import { ModelValidationError } from "@/lib/CustomErrors";

export default class Name {
  private readonly name: string;

  constructor(name: string) {
    if (name.length < 3 || name.trim().length === 0) {
      throw new ModelValidationError("Nome inválido.", "Confira o nome e tente novamente.", 400, true);
    }

    this.name = name;
  }

  getValue() {
    return this.name;
  }
}
