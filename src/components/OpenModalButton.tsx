import { IoAddSharp } from "react-icons/io5";

interface OpenModalButtonProps {
  desktopType?: boolean;
}

export default function OpenModalButton({ desktopType }: OpenModalButtonProps) {
  const desktopCSS = "hidden sm:block py-2 px-4 rounded-md self-end hover:bg-blue-900 hover:scale-105";
  const mobileCSS = "block sm:hidden fixed right-4 bottom-4 rounded-full p-3 active:bg-blue-900 active:scale-110";

  return (
    <button className={`bg-blue-800 transition ${desktopType ? desktopCSS : mobileCSS}`}>
      {desktopType ? "Adicionar" : <IoAddSharp className="text-4xl" />}
    </button>
  );
}
