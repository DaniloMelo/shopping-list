import { ButtonHTMLAttributes, ReactNode } from "react";
import { CgSpinner } from "react-icons/cg";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading: boolean;
}

export default function AuthButton({ children, loading, ...rest }: AuthButtonProps) {
  return (
    <button
      className={`${rest.disabled ? "bg-zinc-500" : "bg-blue-800 hover:bg-blue-500"} text-white outline-blue-300 rounded-md p-2 mt-4 font-semibold transition-colors duration-300`}
      {...rest}
    >
      <div className="flex justify-center">
        <CgSpinner className={`${loading ? "animate-spin" : "hidden"} text-2xl mx-2`} />
        {children}
      </div>
    </button>
  );
}
