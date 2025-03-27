import { InputHTMLAttributes } from "react";

export default function ModalInput({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="border-b border-zinc-500 focus-within:border-zinc-300 hover:border-zinc-300">
      <input className="w-full px-2 outline-none bg-black text-gray-400 placeholder-zinc-600" {...props} />
    </div>
  );
}
