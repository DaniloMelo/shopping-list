import { useEffect, useState } from "react";
import useProduct from "./useProduct";
import { useSWRConfig } from "swr";
import NumberFormatter from "@/lib/NumberFormatter";
import { PublicError } from "@/lib/CustomErrors";
import useModal from "./useModal";
import { useFetch } from "./useFetch";

export interface IUpdatedProduct {
  id: string;
  productName: string;
  productPrice: string;
  productQuantity: string;
}

export function useUpdateProductFetch() {
  const [product, setProduct] = useState<IUpdatedProduct>({
    id: "",
    productName: "",
    productPrice: "",
    productQuantity: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAction, setErrorAction] = useState("");

  const { getProductToUpdate } = useProduct();
  const { toggleIsUpdateProductModalOpen } = useModal();
  const { fetchUpdateProduct } = useFetch();
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (getProductToUpdate) {
      setProduct({
        id: getProductToUpdate.id,
        productName: getProductToUpdate.productName,
        productPrice: NumberFormatter.toBRL(getProductToUpdate.productPrice).substring(3),
        productQuantity: getProductToUpdate.productQuantity.toString(),
      });
    }
  }, [getProductToUpdate]);

  async function handleSubmit(e: React.FormEvent, userId: string) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetchUpdateProduct({ userId, product });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.isPublicError) throw new PublicError(errorData.message, errorData.action);
      }

      mutate(`/api/v1/product/list-products/${userId}`);
      toggleIsUpdateProductModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof PublicError) {
        setErrorMessage(error.message);
        setErrorAction(error.action);
        setIsLoading(false);
        setTimeout(() => {
          setErrorMessage("");
          setErrorAction("");
        }, 2000);
      }
    }
  }

  return {
    product,
    setProduct,
    errorMessage,
    errorAction,
    isLoading,
    handleSubmit,
  };
}
