import { IoSearch } from "react-icons/io5";
import { RiCloseLargeLine } from "react-icons/ri";

interface IFilterProductsProps {
  value: string;
  onSearchChange: (product: string) => void;
}

export default function FilterProducts({ value, onSearchChange }: IFilterProductsProps) {
  return (
    <div
      className="flex justify-between items-center px-2 mb-2 mt-10 w-8/12 max-w-[500px] 
        border-b-2 border-zinc-500 text-zinc-600  focus-within:border-zinc-900  hover:border-zinc-900
      dark:border-zinc-400 dark:text-zinc-300 dark:focus-within:border-zinc-200 dark:hover:border-zinc-200"
    >
      <input
        className="border-none outline-none flex-1 bg-primaryLightBG placeholder:text-zinc-600
          dark:bg-primaryDarkBG dark:placeholder:text-zinc-400"
        type="text"
        placeholder="Procurar"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
      />

      {value ? (
        <RiCloseLargeLine
          className="cursor-pointer text-zinc-900 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-200"
          onClick={() => onSearchChange("")}
        />
      ) : (
        <IoSearch className="text-zinc-600 dark:text-zinc-400" />
      )}
    </div>
  );
}
