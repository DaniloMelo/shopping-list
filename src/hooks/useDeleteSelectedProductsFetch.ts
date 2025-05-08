import { useState } from "react";
import { useSWRConfig } from "swr";
import useProduct from "./useProduct";

export function useDeleteSelectedProductsFetch(userId: string) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { productsToDelete, cleanProductsToDelete } = useProduct();
  const { mutate } = useSWRConfig();

  async function handleDelete() {
    try {
      await fetch("/api/v1/product/delete/selected", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: productsToDelete,
        }),
      });

      mutate(`/api/v1/product/list-products/${userId}`);

      cleanProductsToDelete();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("error", error);
    }
  }

  function dialogConfirmation(confirmation: boolean) {
    if (confirmation) {
      handleDelete();
    } else {
      setIsDialogOpen(false);
    }
  }

  return {
    isDialogOpen,
    setIsDialogOpen,
    productsToDelete,
    dialogConfirmation,
  };
}
