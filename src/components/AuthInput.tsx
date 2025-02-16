import { ElementType, InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  Icon: ElementType;
}

export default function AuthInput({ Icon, ...rest }: AuthInputProps) {
  return (
    <div className="flex justify-center items-center p-1 border-b border-zinc-500 hover:border-zinc-300">
      <Icon className="text-xl mr-2" />
      <input className="w-full placeholder-zinc-500 bg-black outline-none" {...rest}></input>
    </div>
  );
}
