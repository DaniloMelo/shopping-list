import { ElementType, InputHTMLAttributes } from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "900"],
  variable: "--font-montserrat",
});

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  Icon?: ElementType;
}

export default function AuthInput({ Icon, ...rest }: AuthInputProps) {
  return (
    <label
      className={`${montserrat.variable} flex justify-center items-center p-1 border-b
      bg-primaryLightBG border-zinc-700 focus-within:border-zinc-400 hover:border-zinc-400 text-lightTxt 
      dark:bg-primaryDarkBG dark:border-zinc-500 dark:text-darkTxt`}
    >
      {Icon && <Icon className="text-xl mr-2" />}
      <input
        className="w-full outline-none font-[500] placeholder-zinc-400 placeholder:font-[500] bg-primaryLightBG dark:bg-primaryDarkBG dark:placeholder-zinc-600"
        {...rest}
      />
    </label>
  );
}
