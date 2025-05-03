// import { CgSpinner } from "react-icons/cg";
// import ModalInput from "./ModalInput";
// import React, { useEffect, useState } from "react";
// import useProduct from "@/hooks/useProduct";
// import NumberFormatter from "@/lib/NumberFormatter";
// import { PublicError } from "@/lib/CustomErrors";
// import { useSWRConfig } from "swr";
// import useModal from "@/hooks/useModal";

// interface IUpdatedProduct {
//   id: string;
//   productName: string;
//   productPrice: string;
//   productQuantity: string;
// }

// interface IUpdatedProductModalProps {
//   userId: string;
// }

// export default function UpdateProductModal({ userId }: IUpdatedProductModalProps) {
//   const { isUpdateProductModalOpen, toggleIsUpdateProductModalOpen } = useModal();

//   const [product, setProduct] = useState<IUpdatedProduct>({
//     id: "",
//     productName: "",
//     productPrice: "",
//     productQuantity: "",
//   });
//   const { getProductToUpdate } = useProduct();
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [errorAction, setErrorAction] = useState("");

//   const { mutate } = useSWRConfig();

//   useEffect(() => {
//     if (getProductToUpdate) {
//       setProduct({
//         id: getProductToUpdate.id,
//         productName: getProductToUpdate.productName,
//         productPrice: NumberFormatter.toBRL(getProductToUpdate.productPrice).substring(3),
//         productQuantity: getProductToUpdate.productQuantity.toString(),
//       });
//     }
//   }, [getProductToUpdate]);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/v1/product/update-product", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: userId,
//           productId: product.id,
//           productName: product.productName,
//           productPrice: NumberFormatter.toNumber(product.productPrice),
//           productQuantity: NumberFormatter.toNumber(product.productQuantity),
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (errorData.isPublicError) throw new PublicError(errorData.message, errorData.action);
//       }

//       mutate(`/api/v1/product/list-products/${userId}`);
//       toggleIsUpdateProductModalOpen(false);
//       setIsLoading(false);
//     } catch (error) {
//       if (error instanceof PublicError) {
//         setErrorMessage(error.message);
//         setErrorAction(error.action);
//         setIsLoading(false);
//         setTimeout(() => {
//           setErrorMessage("");
//           setErrorAction("");
//         }, 2000);
//       }
//     }
//   }

//   return (
//     <div
//       className={`flex justify-center items-center fixed h-screen w-screen bg-zinc-700/50 backdrop-blur-sm z-10 ${isUpdateProductModalOpen ? "fixed" : "hidden"}`}
//     >
//       <section className="flex flex-col flex-1 max-w-4xl p-8 mx-8 rounded-lg bg-primaryLightBG dark:bg-primaryDarkBG">
//         <button className="self-end hover:text-zinc-500" onClick={() => toggleIsUpdateProductModalOpen(false)}>
//           X
//         </button>

//         <h2 className="text-lg mb-6 text-lightTxt dark:text-darkTxt">Edite um produto</h2>

//         <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
//           <ModalInput
//             type="text"
//             placeholder="Nome"
//             value={product.productName}
//             onChange={(e) => setProduct({ ...product, productName: e.target.value })}
//             required
//           />

//           <ModalInput
//             type="text"
//             placeholder="Preço. Ex: 19,90"
//             value={product.productPrice}
//             onChange={(e) => setProduct({ ...product, productPrice: e.target.value })}
//             required
//           />

//           <ModalInput
//             type="number"
//             placeholder="Quantidade"
//             value={product.productQuantity}
//             onChange={(e) => setProduct({ ...product, productQuantity: e.target.value })}
//             required
//           />

//           {errorMessage && (
//             <div>
//               <div className="bg-red-900/50 w-full p-5 mt-5 text-sm text-center rounded-md">
//                 <p className="mb-2">{errorMessage}</p>
//                 <p>{errorAction}</p>
//               </div>
//             </div>
//           )}

//           <button
//             className="rounded-md py-2 bg-cyan-700 hover:bg-cyan-900 text-zinc-300 outline-blue-300"
//             disabled={isLoading && true}
//           >
//             <div className="flex justify-center">
//               <CgSpinner className={`${isLoading ? "animate-spin" : "hidden"} text-2xl mx-2`} />
//               {isLoading ? "Editando..." : "Editar"}
//             </div>
//           </button>
//         </form>
//       </section>
//     </div>
//   );
// }

// ------------------------------

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
    >
      <section className="flex flex-col flex-1 max-w-4xl p-8 mx-8 rounded-lg bg-primaryLightBG dark:bg-primaryDarkBG">
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
