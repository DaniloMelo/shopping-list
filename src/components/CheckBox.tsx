/* eslint-disable react-hooks/exhaustive-deps */
import useProduct from "@/hooks/useProduct";
import { useEffect, useState } from "react";

interface ICheckBoxProps {
  productId: string;
}

export default function CheckBox({ productId }: ICheckBoxProps) {
  const [checked, setChecked] = useState(false);

  const { addProductToDelete, removeProductToDele } = useProduct();

  function handleChecked() {
    setChecked((prev) => !prev);
  }

  useEffect(() => {
    if (checked) {
      addProductToDelete(productId);
    } else {
      removeProductToDele(productId);
    }
  }, [checked, productId]);

  return (
    <div className="relative">
      <input
        type="checkbox"
        className="peer appearance-none cursor-pointer h-5 w-5 rounded-sm bg-secondaryLightBG dark:bg-secondaryDarkBG border border-zinc-500 checked:border-blue-500 dark:checked:border-zinc-500 checked:bg-blue-500 dark:checked:bg-zinc-500"
        onClick={(e) => {
          handleChecked();
          e.stopPropagation();
        }}
      />
      <span className="hidden pointer-events-none absolute top-0 left-0 h-5 w-5 peer-checked:flex items-center justify-center text-white font-bold checked:content-['✓']">
        ✓
      </span>
    </div>
  );
}
