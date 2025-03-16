import NumberFormatter from "@/lib/NumberFormatter";
import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

export interface ProductProps {
  id?: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
}

export default function Product({ productName, productPrice, productQuantity }: ProductProps) {
  const [isDetailsHidden, setIsDetailsHidden] = useState(false);

  return (
    <div className="mb-4 p-3 bg-zinc-800 text-zinc-300 rounded-md">
      <div className="flex justify-between" onClick={() => setIsDetailsHidden(!isDetailsHidden)}>
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
      </div>
    </div>
  );
}
