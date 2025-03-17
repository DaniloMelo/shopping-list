import { ProductProps } from "@/components/Product";

export default function filterProducts(search: string, shoppingList: ProductProps[]) {
  const filteredProducts = shoppingList.filter((p) => {
    const searchNormalized = search.toLowerCase();
    const productNameNormalized = p.productName.toLocaleLowerCase();

    return productNameNormalized.includes(searchNormalized);
  });

  return filteredProducts;
}
