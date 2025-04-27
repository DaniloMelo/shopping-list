import { Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

type LogoProps = {
  size: "sm" | "md" | "lg";
  removeName?: boolean;
};

export default function Logo({ size, removeName }: LogoProps) {
  return (
    <div className={`${montserrat.variable} flex flex-col items-center`}>
      <Image
        src="/shopping-bags-svgrepo-com.svg"
        alt="Logo Shopping List"
        width={size === "sm" ? 50 : size === "md" ? 75 : 100}
        height={size === "sm" ? 50 : size === "md" ? 75 : 100}
        priority
      />

      <p
        className={`${removeName && "hidden"} ${size === "sm" ? "text-sm" : size === "md" ? "text-" : "text-3xl"} mt-2 font-montserrat`}
      >
        Shopping List
      </p>
    </div>
  );
}
