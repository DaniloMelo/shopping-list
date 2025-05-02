import NumberFormatter from "@/lib/NumberFormatter";
import ModalInput from "./ModalInput";
import { useState } from "react";
import { PublicError } from "@/lib/CustomErrors";
import { CgSpinner } from "react-icons/cg";
import { useSWRConfig } from "swr";

interface ModalProps {
  isModalOpen: boolean;
  onModalOpen(visible: boolean): void;
  userId: string;
}

interface INewProduct {
  productName: string;
  productPrice: string;
  productQuantity: string;
}

export default function CreateProductModal({ isModalOpen, userId, onModalOpen }: ModalProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAction, setErrorAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<INewProduct>({
    productName: "",
    productPrice: "",
    productQuantity: "",
  });

  const { mutate } = useSWRConfig();

  async function handleSubmit(e: React.FormEvent) {
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
      onModalOpen(false);
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

  return (
    <section
      className={`flex justify-center items-center fixed h-screen w-screen bg-zinc-700/50 backdrop-blur-sm z-10 ${isModalOpen ? "fixed" : "hidden"}`}
    >
      <div className="flex flex-col flex-1 max-w-4xl p-8 mx-8 rounded-lg bg-primaryLightBG dark:bg-primaryDarkBG">
        <button className="self-end hover:text-zinc-500" onClick={() => onModalOpen(false)}>
          X
        </button>

        <h2 className="text-lg mb-6 text-lightTxt dark:text-darkTxt">Adicione um novo produto</h2>

        <form className="flex flex-col gap-5" onSubmit={(e) => handleSubmit(e)}>
          <ModalInput
            type="text"
            placeholder="Nome"
            value={product.productName}
            onChange={(e) => setProduct({ ...product, productName: e.target.value })}
            required
          />

          <ModalInput
            type="text"
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
