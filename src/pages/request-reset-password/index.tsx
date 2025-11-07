import AuthButton from "@/components/AuthButton";
import AuthInput from "@/components/AuthInput";
import Logo from "@/components/Logo";
import PageTitle from "@/components/PageTitle";
import { useRequestResetPasswordFetch } from "@/hooks/useRequestResetPasswordFetch";
import Link from "next/link";
import { IoIosMail } from "react-icons/io";

export default function RequestResetPasswordPage() {
  const { email, setEmail, formErrorMessage, formErrorAction, formSuccess, isLoading, isDisabled, handleSubmit } =
    useRequestResetPasswordFetch();

  return (
    <>
      <PageTitle title="Redefinição de senha" />

      <main className="h-screen flex justify-center">
        <section className="flex flex-col justify-center items-center w-80 py-10">
          <Logo size="md" />

          <h1 className="text-xl self-start mt-10 mb-5">Redefinição de senha</h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-10">
            Caso tenha um usuário cadastrado e válido, receberá um email com instruções de como redefinir a sua senha.
          </p>

          <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <AuthInput
              Icon={IoIosMail}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {formErrorMessage && (
              <div className="bg-red-900/50 w-full p-5 mt-5 text-sm text-center rounded-md">
                <p className="mb-2">{formErrorMessage}</p>
                <p>{formErrorAction}</p>
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-900/50 w-full p-5 mt-5 text-sm text-center rounded-md">
                <p>{formSuccess}</p>
              </div>
            )}

            <AuthButton loading={isLoading} disabled={isDisabled}>
              {isLoading ? "Enviando" : "Enviar"}
            </AuthButton>

            <p className="text-blue-800 text-end text-sm">
              <Link href="/login" className="hover:text-blue-500 ">
                Voltar para o login
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}
