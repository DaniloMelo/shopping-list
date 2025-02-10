import useSWR from "swr";
import { MdErrorOutline } from "react-icons/md";
import { FiDatabase } from "react-icons/fi";
import LoadingSpinner from "@/components/LoadingSpinner";

async function fetchAPI(key: string) {
  const response = await fetch(key);
  if (!response.ok) {
    throw new Error("Algum erro inesperado ocorreu! Tente mais tarde.");
  }
  const status = await response.json();
  return status;
}

export default function StatusPage() {
  const { data, error } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 60000,
  });

  return (
    <main className="p-4">
      <h1 className="text-2xl font-black">Status dos serviços</h1>

      <section className="flex items-center">
        <p className="font-bold mr-2">Última atualização:</p>
        {data ? data.updated_at : <LoadingSpinner />}
      </section>

      {error && (
        <div className="flex items-center my-5">
          <MdErrorOutline className="text-red-700 text-2xl mr-2" />
          {error.message}
        </div>
      )}

      <section className="my-16">
        <div className="flex items-center">
          <FiDatabase className="text-2xl mr-2" />
          <h2 className="font-black">Banco de Dados</h2>
        </div>

        {data ? (
          <div className="flex items-center my-3 ">
            <div className="bg-green-700 w-3 h-3 mr-2 rounded-full animate-pulse"></div>
            <p>Operacional</p>
          </div>
        ) : error ? (
          <div className="flex items-center my-3 ">
            <div className="bg-red-700 w-3 h-3 mr-2 rounded-full animate-pulse"></div>
            <p>Inoperante</p>
          </div>
        ) : (
          <LoadingSpinner />
        )}

        <div>
          <p className="flex items-center">
            <span className="font-bold mr-2">Versão do banco de dados:</span>
            {data ? data.dependencies.database.server_version : <LoadingSpinner />}
          </p>

          <p className="flex items-center">
            <span className="font-bold mr-2">Conexões máximas:</span>
            {data ? data.dependencies.database.max_connections : <LoadingSpinner />}
          </p>

          <p className="flex items-center">
            <span className="font-bold mr-2">Conexões abertas:</span>
            {data ? data.dependencies.database.open_connections : <LoadingSpinner />}
          </p>
        </div>
      </section>
    </main>
  );
}
