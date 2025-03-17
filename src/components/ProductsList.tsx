import Product, { ProductProps } from "./Product";

export interface ProductsListProps {
  shoppingList: ProductProps[];
}

export default function ProductsList({ shoppingList }: ProductsListProps) {
  return (
    <div className="px-4 pt-4 w-full max-w-[1000px]">
      {shoppingList.map((p) => {
        return (
          <Product
            key={p.id}
            productName={p.productName}
            productPrice={p.productPrice}
            productQuantity={p.productQuantity}
          />
        );
      })}
    </div>
  );
}
