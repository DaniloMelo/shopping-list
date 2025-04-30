import { useFetch } from "@/hooks/useFetch";
import { useRouter } from "next/router";
import { TbLogout } from "react-icons/tb";

interface LogoutButtonProps {
  userEmail: string;
}

export default function LogoutButton({ userEmail }: LogoutButtonProps) {
  const Router = useRouter();
  const { fetchLogout } = useFetch();

  async function handleLogout(userEmail: string) {
    await fetchLogout(userEmail);
    Router.push("/login");
  }

  return (
    <button
      className="flex justify-center items-center w-full py-1 px-4 border-b 
        text-lightTxt hover:text-zinc-500 border-zinc-500 hover:border-zinc-400
        dark:text-darkTxt dark:hover:text-zinc-400 dark:border-zinc-300 dark:hover:border-zinc-400"
      onClick={() => handleLogout(userEmail)}
    >
      <span className="">Sair</span>
      <TbLogout className="text-xl ml-2" />
    </button>
  );
}
