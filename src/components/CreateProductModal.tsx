import { useCreateProductFetch } from "@/hooks/useCreateProductFetch";
import ModalInput from "./ModalInput";
import { CgSpinner } from "react-icons/cg";
import useModal from "@/hooks/useModal";

export default function CreateProductModal() {
  const { product, setProduct, isLoading, errorMessage, errorAction, handleSubmit } = useCreateProductFetch();
  const { isCreateProductModalOpen, toggleIsCreateProductModalOpen } = useModal();

  return (
    <section
      className={`flex justify-center items-center fixed h-screen w-screen bg-zinc-700/50 backdrop-blur-sm z-10 ${isCreateProductModalOpen ? "fixed" : "hidden"}`}
      onClick={() => toggleIsCreateProductModalOpen(false)}
    >
      <div
        className="flex flex-col flex-1 max-w-4xl p-8 mx-8 rounded-lg bg-primaryLightBG dark:bg-primaryDarkBG"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="self-end hover:text-zinc-500" onClick={() => toggleIsCreateProductModalOpen(false)}>
          X
        </button>

        <h2 className="text-lg mb-6 text-lightTxt dark:text-darkTxt">Adicione um novo produto</h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
            className="bg-cyan-700 hover:bg-cyan-900 text-zinc-200 outline-blue-300 py-2 rounded-md"
            disabled={isLoading && true}
          >
            <div className="flex justify-center">
              <CgSpinner className={`${isLoading ? "animate-spin" : "hidden"} text-2xl mx-2`} />
              {isLoading ? "Adicionando..." : "Adicionar"}
            </div>
          </button>
        </form>
      </div>
    </section>
  );
}
