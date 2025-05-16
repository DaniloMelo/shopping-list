import { NumberFormatterError, PublicError } from "@/lib/CustomErrors";
import { useState } from "react";
import { useSWRConfig } from "swr";
import useModal from "./useModal";
import { useFetch } from "./useFetch";
import NumberFormatter from "@/lib/NumberFormatter";

export interface INewProduct {
  productName: string;
  productPrice: string;
  productQuantity: string;
}

export function useCreateProductFetch() {
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAction, setErrorAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<INewProduct>({
    productName: "",
    productPrice: "",
    productQuantity: "",
  });

  const { toggleIsCreateProductModalOpen } = useModal();
  const { fetchCreateProduct } = useFetch();
  const { mutate } = useSWRConfig();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setErrorAction("");
    setIsLoading(true);

    try {
      const parsedProduct = {
        ...product,
        productPrice: NumberFormatter.BRLToCents(product.productPrice),
        productQuantity: Number(product.productQuantity),
      };

      const response = await fetchCreateProduct(parsedProduct);

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.isPublicError) {
          throw new PublicError(errorData.message, errorData.action);
        }
      }

      mutate(`/api/v1/product/list-products`);
      toggleIsCreateProductModalOpen(false);
      setIsLoading(false);
      setProduct({ productName: "", productPrice: "", productQuantity: "" });
    } catch (error) {
      if (error instanceof PublicError || error instanceof NumberFormatterError) {
        setErrorMessage(error.message);
        setErrorAction(error.action);
        setIsLoading(false);
        setTimeout(() => {
          setErrorMessage("");
          setErrorAction("");
        }, 4000);
      }
    }
  }

  return {
    product,
    setProduct,
    isLoading,
    errorMessage,
    errorAction,
    handleSubmit,
  };
}
