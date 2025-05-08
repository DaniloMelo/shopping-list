import { GoTrash } from "react-icons/go";
import ConfirmationDialog from "./ConfirmationDialog";
import { useDeleteSelectedProductsFetch } from "@/hooks/useDeleteSelectedProductsFetch";

interface IDeleteSelectedProductsBtn {
  desktopType?: boolean;
  userId: string;
}

export default function DeleteSelectedProductsButton({ desktopType, userId }: IDeleteSelectedProductsBtn) {
  const { isDialogOpen, setIsDialogOpen, productsToDelete, dialogConfirmation } =
    useDeleteSelectedProductsFetch(userId);

  const desktopCSS = "hidden sm:block py-2 px-4 my-4 rounded-md self-start transition hover:bg-red-900 hover:scale-105";
  const mobileCSS = "block sm:hidden fixed right-4 bottom-4 rounded-full p-3 active:bg-red-900 active:scale-110";

  return (
    <>
      <button
        className={`flex items-center justify-center bg-red-500 text-white ${desktopType ? desktopCSS : mobileCSS}`}
        onClick={() => setIsDialogOpen(true)}
      >
        {desktopType ? "Excluir itens selecionados" : <GoTrash className="text-4xl" />}
      </button>

      <ConfirmationDialog
        message={`Deseja exluir ${productsToDelete.length} ${productsToDelete.length === 1 ? "item?" : "itens?"}`}
        isOpen={isDialogOpen}
        onConfirmation={dialogConfirmation}
      />
    </>
  );
}
