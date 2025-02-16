import { Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

type LogoProps = {
  size: "sm" | "md" | "lg";
};

export default function Logo({ size }: LogoProps) {
  return (
    <div className={`${montserrat.variable} flex flex-col items-center`}>
      <Image
        src="/shopping-bags-svgrepo-com.svg"
        alt="Logo Lista de Compras"
        width={size === "sm" ? 100 : size === "md" ? 150 : 200}
        height={size === "sm" ? 100 : size === "md" ? 150 : 200}
      />

      <p className={`${size === "sm" ? "text-md" : size === "md" ? "text-xl" : "text-3xl"} mt-2 font-montserrat`}>
        Lista de Compras
      </p>
    </div>
  );
}
