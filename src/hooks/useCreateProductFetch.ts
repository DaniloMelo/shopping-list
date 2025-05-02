import { PublicError } from "@/lib/CustomErrors";
import NumberFormatter from "@/lib/NumberFormatter";
import { useState } from "react";
import { useSWRConfig } from "swr";

interface INewProduct {
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

  const { mutate } = useSWRConfig();

  async function handleSubmit(e: React.FormEvent, userId: string) {
    e.preventDefault();
    setErrorMessage("");
    setErrorAction("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/v1/product/create-product/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.productName,
          productPrice: NumberFormatter.toNumber(product.productPrice),
          productQuantity: NumberFormatter.toNumber(product.productQuantity),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.isPublicError) {
          throw new PublicError(errorData.message, errorData.action);
        }
      }

      mutate(`/api/v1/product/list-products/${userId}`);
      // onModalOpen(false);
      setIsLoading(false);
      setProduct({ productName: "", productPrice: "", productQuantity: "" });
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
    isLoading,
    errorMessage,
    errorAction,
    handleSubmit,
  };
}
