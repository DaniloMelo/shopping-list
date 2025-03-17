import { IoSearch } from "react-icons/io5";
import { RiCloseLargeLine } from "react-icons/ri";

interface IFilterProductsProps {
  value: string;
  onSearchChange: (product: string) => void;
}

export default function FilterProducts({ value, onSearchChange }: IFilterProductsProps) {
  return (
    <div className="flex justify-between items-center border-b border-zinc-400 text-zinc-300 focus-within:border-zinc-200 hover:border-zinc-200 px-2 mb-2 mt-4 w-8/12 max-w-[500px]">
      <input
        className="border-none outline-none bg-black "
        type="text"
        placeholder="Procurar"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
      />

      {value ? (
        <RiCloseLargeLine
          className="text-zinc-400 cursor-pointer hover:text-zinc-200"
          onClick={() => onSearchChange("")}
        />
      ) : (
        <IoSearch className="text-zinc-400" />
      )}
    </div>
  );
}
