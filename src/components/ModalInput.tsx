import { InputHTMLAttributes } from "react";

export default function ModalInput({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      className="border-b border-zinc-700 focus-within:border-zinc-400 hover:border-zinc-400 text-lightTxt 
        dark:border-zinc-500 dark:focus-within:border-zinc-300 dark:hover:border-zinc-300"
    >
      <input
        className="w-full px-2 outline-none bg-primaryLightBG placeholder-zinc-500 font-[500]
          dark:bg-primaryDarkBG dark:text-gray-400 dark:placeholder-zinc-600"
        {...props}
      />
    </div>
  );
}
