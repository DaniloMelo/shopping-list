export default function dateFormatter(date: string) {
  return new Date(date).toLocaleString("pt-BR");
}
