import LogoutButton from "./LogoutButton";
import { RiCloseLargeLine } from "react-icons/ri";

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
        className={`fixed top-0 left-0 flex flex-col h-screen gap-y-5 w-60 bg-zinc-800 p-4 z-30 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <RiCloseLargeLine className="self-end text-xl hover:text-zinc-400" onClick={() => onMenuOpen(false)} />

        <p>To-do: troca de tema</p>

        <LogoutButton userEmail={userEmail} />
      </nav>
    </>
  );
}
