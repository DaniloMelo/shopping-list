import useProduct from "@/hooks/useProduct";
import NumberFormatter from "@/lib/NumberFormatter";
import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { useSWRConfig } from "swr";
import ConfirmationDialog from "./ConfirmationDialog";
import { useFetch } from "@/hooks/useFetch";
import useModal from "@/hooks/useModal";
import CheckBox from "./CheckBox";

export interface ProductProps {
  id: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
}

export default function Product({ id, productName, productPrice, productQuantity }: ProductProps) {
  const [isDetailsHidden, setIsDetailsHidden] = useState(false);
  const [isDialogOpen, SetIsDialogOpen] = useState(false);
  const { productToUpdate } = useProduct();
  const { fetchDeleteProduct } = useFetch();

  const { toggleIsUpdateProductModalOpen } = useModal();
  const { mutate } = useSWRConfig();

  function handleUpdateProduct() {
    productToUpdate({ id, productName, productPrice, productQuantity });
  }

  async function handleDeleteProduct() {
    try {
      await fetchDeleteProduct(id);
      mutate(`/api/v1/product/list-products`);

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
    <div className="p-3 rounded-md bg-secondaryLightBG dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-md dark:shadow-none">
      <div className="flex justify-between cursor-pointer" onClick={() => setIsDetailsHidden(!isDetailsHidden)}>
        <div className="flex items-center gap-x-4">
          <CheckBox productId={id} />
          <p className="font-semibold">{productName}</p>
        </div>
        <div className="ml-4 text-xl items-start">
          <IoIosArrowUp
            className={`transition transform duration-300 ${isDetailsHidden ? "rotate-180" : "rotate-0"}`}
          />
        </div>
      </div>

      <hr className={`border-t border-zinc-500 mt-2 mb-4 ${isDetailsHidden && "hidden"}`} />

      <div className={`mb-2 ${isDetailsHidden && "hidden"}`}>
        <p>{NumberFormatter.centsToBRL(productPrice)}</p>

        <p className="my-2">Quantidade: {productQuantity}</p>

        <div className="flex justify-start items-center gap-x-4 mt-6">
          <button
            className="bg-primaryBtnColor hover:bg-primaryBtnColorHover active:bg-primaryBtnColorHover text-zinc-200 py-1 px-4 rounded-md"
            onClick={() => {
              toggleIsUpdateProductModalOpen(true);
              handleUpdateProduct();
            }}
          >
            Editar
          </button>

          <button
            className="bg-secondaryBtnColor hover:bg-secondaryBtnColorHover active:bg-secondaryBtnColorHover text-zinc-200 py-1 px-4 rounded-md"
            onClick={() => SetIsDialogOpen(true)}
          >
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
