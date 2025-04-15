import { useRouter } from "next/router";
import { TbLogout } from "react-icons/tb";

interface LogoutButtonProps {
  userEmail: string;
}

export default function LogoutButton({ userEmail }: LogoutButtonProps) {
  const Router = useRouter();

  async function handleLogout(userEmail: string) {
    await fetch("api/v1/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });

    Router.push("/login");
  }

  return (
    <button
      className="flex justify-center items-center w-full py-1 px-4 border-b text-zinc-300 hover:text-zinc-400 border-zinc-300 hover:border-zinc-400"
      onClick={() => handleLogout(userEmail)}
    >
      <span className="">Sair</span>
      <TbLogout className="text-xl ml-2" />
    </button>
  );
}
