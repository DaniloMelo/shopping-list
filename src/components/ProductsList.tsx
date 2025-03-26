import LoadingSpinner from "./LoadingSpinner";
import Product, { ProductProps } from "./Product";
import useSWR from "swr";

export interface ProductsListProps {
  initialProducts: ProductProps[];
  userId: string;
}

async function fetcher(url: string) {
  const response = await fetch(url);
  const products = await response.json();
  return products;
}

export default function ProductsList({ initialProducts, userId }: ProductsListProps) {
  const { data, error } = useSWR(`/api/v1/product/list-products/${userId}`, fetcher, {
    fallback: initialProducts,
  });

  if (error) {
    return (
      <div className="my-5 text-lg text-zinc-300 text-center">
        Erro ao carregar a lista de produtos. Tente novamente mais tarde.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center my-10">
        Carregando <LoadingSpinner />{" "}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-y-4 py-10">
      {data.map((p: ProductProps) => {
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
