export default class NumberFormatter {
  static toBRL(value: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }

  static toNumber(value: string) {
    const price = value.split(" ").filter((v) => v !== "R$");
    return Number(price[0].replace(".", "").replace(",", "."));
  }
}
