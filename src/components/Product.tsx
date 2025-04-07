import useProduct from "@/hooks/useProduct";
import NumberFormatter from "@/lib/NumberFormatter";
import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { useSWRConfig } from "swr";
import ConfirmationDialog from "./ConfirmationDialog";
import { useFetch } from "@/hooks/useFetch";

export interface ProductProps {
  id: string;
  userId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  onUpdateModalOpen(visibility: boolean): void;
}

export default function Product({
  id,
  userId,
  productName,
  productPrice,
  productQuantity,
  onUpdateModalOpen,
}: ProductProps) {
  const [isDetailsHidden, setIsDetailsHidden] = useState(false);
  const [isDialogOpen, SetIsDialogOpen] = useState(false);
  const [dialogConfirmation, setDialogConfirmation] = useState(false);
  const { productToUpdate } = useProduct();
  const { deleteProduct } = useFetch();

  const { mutate } = useSWRConfig();

  console.log("fora => ", dialogConfirmation);

  function handleProductToUpdate() {
    productToUpdate({ id, productName, productPrice, productQuantity });
  }

  async function handleDeleteProduct() {
    try {
      await deleteProduct(id, userId);
      mutate(`/api/v1/product/list-products/${userId}`);

      setDialogConfirmation(false);
      SetIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  function handleDeleteProductConfirmation(confirmation: boolean) {
    if (confirmation) {
      handleDeleteProduct();
    } else {
      SetIsDialogOpen(false);
    }
  }

  return (
    <div className="p-3 bg-zinc-800 text-zinc-300 rounded-md">
      <div className="flex justify-between cursor-pointer" onClick={() => setIsDetailsHidden(!isDetailsHidden)}>
        <p className="font-semibold">{productName}</p>
        <div className="ml-4 text-xl items-start">
          <IoIosArrowUp
            className={`transition transform duration-300 ${isDetailsHidden ? "rotate-180" : "rotate-0"}`}
          />
        </div>
      </div>

      <hr className={`border-t border-zinc-500 mt-2 mb-4 ${isDetailsHidden && "hidden"}`} />

      <div className={`mb-2 ${isDetailsHidden && "hidden"}`}>
        <p>{NumberFormatter.toBRL(productPrice)}</p>

        <p className="my-2">Quantidade: {productQuantity}</p>

        <div className="flex justify-start items-center gap-x-4 mt-6">
          <button
            className="bg-blue-700 hover:bg-blue-800 py-1 px-4 rounded-md"
            onClick={() => {
              onUpdateModalOpen(true);
              handleProductToUpdate();
            }}
          >
            Editar
          </button>

          <button className="bg-red-700 hover:bg-red-800 py-1 px-4 rounded-md" onClick={() => SetIsDialogOpen(true)}>
            Excluir
          </button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        message={`Deseja excluir ${productName}?`}
        onConfirmation={handleDeleteProductConfirmation}
      />
    </div>
  );
}
