import LogoutButton from "./LogoutButton";
import { RiCloseLargeLine } from "react-icons/ri";
import ToggleThemeButton from "./ToggleThemeButton";

interface MenuProps {
  userEmail: string;
  isOpen: boolean;
  onMenuOpen(value: boolean): void;
}

export default function Menu({ userEmail, isOpen, onMenuOpen }: MenuProps) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-20 transition-opacity duration-300 ease-in-out 
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => onMenuOpen(false)}
      />

      <nav
        className={`fixed top-0 left-0 flex flex-col justify-between h-screen gap-y-5 w-60 bg-secondaryLightBG dark:bg-secondaryDarkBG p-4 z-30 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col gap-y-5">
          <RiCloseLargeLine className="self-end text-xl hover:text-zinc-400" onClick={() => onMenuOpen(false)} />

          <div className="flex items-center">
            <span className="mr-4">Tema:</span>
            <ToggleThemeButton />
          </div>
        </div>

        <div className="mb-10">
          <LogoutButton userEmail={userEmail} />
        </div>
      </nav>
    </>
  );
}
