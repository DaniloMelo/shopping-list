import { IoAddSharp } from "react-icons/io5";

interface OpenModalButtonProps {
  desktopType?: boolean;
  click(): void;
}

export default function OpenCreateProductModalButton({ desktopType, click }: OpenModalButtonProps) {
  const desktopCSS =
    "hidden sm:block py-2 px-4 my-4 rounded-md self-start hover:bg-primaryBtnColorHover hover:scale-105";

  const mobileCSS =
    "block sm:hidden fixed right-4 bottom-4 rounded-full p-3 active:bg-primaryBtnColorHover active:scale-110";

  return (
    <button
      className={`bg-primaryBtnColor transition text-zinc-200 ${desktopType ? desktopCSS : mobileCSS}`}
      onClick={click}
    >
      {desktopType ? "Adicionar" : <IoAddSharp className="text-4xl" />}
    </button>
  );
}
