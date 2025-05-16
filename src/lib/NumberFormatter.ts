import { NumberFormatterError } from "./CustomErrors";

export default class NumberFormatter {
  static BRLToCents(value: string) {
    if (value.includes(".") && value.includes(",") === false) {
      throw new NumberFormatterError("Preço inválido.", "Use vírgula ao invés de ponto.", 400, true);
    }

    const cleaned = value.replace(/\./g, "").replace(",", ".");

    const decimalPart = cleaned.split(".")[1];
    if (decimalPart && decimalPart.length > 2) {
      throw new NumberFormatterError("Preço inválido.", "Verfique o valor em centavos informado.", 400, true);
    }

    return Number(cleaned) * 100;
  }

  static centsToBRL(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  }
}
