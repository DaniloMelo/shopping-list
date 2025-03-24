import Product, { ProductProps } from "./Product";

export interface ProductsListProps {
  shoppingList: ProductProps[];
}

export default function ProductsList({ shoppingList }: ProductsListProps) {
  return (
    <div className="flex flex-col w-full gap-y-4 py-10">
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
