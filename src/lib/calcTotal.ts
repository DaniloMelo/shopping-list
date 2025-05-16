import { ProductProps } from "@/components/Product";
import NumberFormatter from "./NumberFormatter";

export default function calcTotal(products: ProductProps[]) {
  const value = products.reduce((acc, curr) => acc + curr.productPrice * curr.productQuantity, 0);

  return NumberFormatter.centsToBRL(value);
}
