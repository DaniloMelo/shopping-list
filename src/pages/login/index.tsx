import Attribution from "@/components/Attribution";
import AuthButton from "@/components/AuthButton";
import AuthInput from "@/components/AuthInput";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
import PageTitle from "@/components/PageTitle";
import { useLoginFetch } from "@/hooks/useLoginFetch";
import Link from "next/link";
import { IoIosMail } from "react-icons/io";
import { MdLock } from "react-icons/md";

export default function LoginPage() {
  const { user, setUser, formErrorMessage, formErrorAction, isDisabled, isLoading, handleSubmit } = useLoginFetch();

  return (
    <>
      <PageTitle title="Login" />

      <Container>
        <main className="h-screen flex flex-col justify-center items-center">
          <section className="flex flex-col flex-1 justify-center items-center w-80 py-10">
            <Logo size="md" />

            <h1 className="text-xl self-start mt-10 mb-5">Entrar</h1>

            <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
              <AuthInput
                Icon={IoIosMail}
                placeholder="Email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />

              <AuthInput
                Icon={MdLock}
                placeholder="Senha"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
              />

              {formErrorMessage && (
                <div className="bg-red-900/50 w-full p-5 mt-5 text-sm text-center rounded-md">
                  <p className="mb-2">{formErrorMessage}</p>
                  <p>{formErrorAction}</p>
                </div>
              )}

              <AuthButton disabled={isDisabled} loading={isLoading}>
                {isLoading ? "Entrando" : "Entrar"}
              </AuthButton>

              <p className="text-blue-800 text-end text-sm">
                <Link href="/request-reset-password" className="hover:text-blue-500 ">
                  Esqueceu sua senha?
                </Link>
              </p>
            </form>

            <Link href="/register" className="mt-10">
              Não tem uma conta? <span className="text-blue-800 hover:text-blue-500">Cadastrar</span>
            </Link>
          </section>

          <footer className="w-full flex items-center">
            <Attribution />

            <section className="pr-2 text-sm text-zinc-600 dark:text-zinc-400 underline">
              <Link href="/status">App Status</Link>
            </section>
          </footer>
        </main>
      </Container>
    </>
  );
}
