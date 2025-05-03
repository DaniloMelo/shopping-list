import filterProducts from "@/lib/filterProducts";
import LoadingSpinner from "./LoadingSpinner";
import Product, { ProductProps } from "./Product";
import useSWR from "swr";
import useProduct from "@/hooks/useProduct";
import { useEffect } from "react";

export interface ProductsListProps {
  initialProducts: ProductProps[];
  userId: string;
  search: string;
  onUpdateProduct(productList: ProductProps[]): void;
}

async function fetcher(url: string) {
  const response = await fetch(url);
  const products = await response.json();
  return products;
}

export default function ProductsList({ initialProducts, userId, search, onUpdateProduct }: ProductsListProps) {
  const { addInitialProducts } = useProduct();
  const { data, error } = useSWR(`/api/v1/product/list-products/${userId}`, fetcher, {
    fallback: initialProducts,
  });

  useEffect(() => {
    if (data) {
      addInitialProducts(data);
      onUpdateProduct(data);
    }
  }, [data, addInitialProducts, onUpdateProduct]);

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

  const filteredData = filterProducts(search, data);

  return (
    <div className="flex flex-col w-full gap-y-4 py-10">
      {filteredData.reverse().map((p: ProductProps) => {
        return (
          <Product
            key={p.id}
            id={p.id}
            userId={userId}
            productName={p.productName}
            productPrice={p.productPrice}
            productQuantity={p.productQuantity}
          />
        );
      })}
    </div>
  );
}
