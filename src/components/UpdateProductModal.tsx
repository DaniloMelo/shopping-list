import { CgSpinner } from "react-icons/cg";
import ModalInput from "./ModalInput";
import useModal from "@/hooks/useModal";
import { useUpdateProductFetch } from "@/hooks/useUpdateProductFetch";

interface IUpdatedProductModalProps {
  userId: string;
}

export default function UpdateProductModal({ userId }: IUpdatedProductModalProps) {
  const { isUpdateProductModalOpen, toggleIsUpdateProductModalOpen } = useModal();
  const { product, setProduct, errorMessage, errorAction, isLoading, handleSubmit } = useUpdateProductFetch();

  return (
    <div
      className={`flex justify-center items-center fixed h-screen w-screen bg-zinc-700/50 backdrop-blur-sm z-10 ${isUpdateProductModalOpen ? "fixed" : "hidden"}`}
      onClick={() => toggleIsUpdateProductModalOpen(false)}
    >
      <section
        className="flex flex-col flex-1 max-w-4xl p-8 mx-8 rounded-lg bg-primaryLightBG dark:bg-primaryDarkBG"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="self-end hover:text-zinc-500" onClick={() => toggleIsUpdateProductModalOpen(false)}>
          X
        </button>

        <h2 className="text-lg mb-6 text-lightTxt dark:text-darkTxt">Edite um produto</h2>

        <form className="flex flex-col gap-5" onSubmit={(e) => handleSubmit(e, userId)}>
          <ModalInput
            type="text"
            placeholder="Nome"
            value={product.productName}
            onChange={(e) => setProduct({ ...product, productName: e.target.value })}
            required
          />

          <ModalInput
            type="text"
            inputMode="numeric"
            placeholder="Preço. Ex: 19,90"
            value={product.productPrice}
            onChange={(e) => setProduct({ ...product, productPrice: e.target.value })}
            required
          />

          <ModalInput
            type="number"
            placeholder="Quantidade"
            value={product.productQuantity}
            onChange={(e) => setProduct({ ...product, productQuantity: e.target.value })}
            required
          />

          {errorMessage && (
            <div>
              <div className="bg-red-900/50 w-full p-5 mt-5 text-sm text-center rounded-md">
                <p className="mb-2">{errorMessage}</p>
                <p>{errorAction}</p>
              </div>
            </div>
          )}

          <button
            className="rounded-md py-2 bg-cyan-700 hover:bg-cyan-900 text-zinc-300 outline-blue-300"
            disabled={isLoading && true}
          >
            <div className="flex justify-center">
              <CgSpinner className={`${isLoading ? "animate-spin" : "hidden"} text-2xl mx-2`} />
              {isLoading ? "Editando..." : "Editar"}
            </div>
          </button>
        </form>
      </section>
    </div>
  );
}
