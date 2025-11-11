import Logo from "@/components/Logo";
import { MdPerson } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { MdLock } from "react-icons/md";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";
import { useRegisterFetch } from "@/hooks/useRegisterFetch";
import PageTitle from "@/components/PageTitle";
import Attribution from "@/components/Attribution";
import Container from "@/components/Container";

export default function RegisterPage() {
  const { newUser, setNewUser, isDisabled, isLoading, formErrorMessage, formErrorAction, formSuccess, handleSubmit } =
    useRegisterFetch();

  return (
    <>
      <PageTitle title="Cadastro" />

      <Container>
        <main className="h-screen flex flex-col justify-center items-center">
          <section className="flex flex-col flex-1 justify-center items-center w-80 py-10">
            <Logo size="md" />

            <h1 className="text-xl self-start mt-10 mb-5">Cadastre-se</h1>

            <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
              <AuthInput
                Icon={MdPerson}
                placeholder="Nome"
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
              <AuthInput
                Icon={IoIosMail}
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />

              <AuthInput
                Icon={MdLock}
                placeholder="Senha"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />

              <AuthInput
                Icon={MdLock}
                placeholder="Confirme a senha"
                type="password"
                value={newUser.passwordConfirmation}
                onChange={(e) => setNewUser({ ...newUser, passwordConfirmation: e.target.value })}
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

              <AuthButton disabled={isDisabled} loading={isLoading}>
                {isLoading ? "Cadastrando" : "Cadastrar"}
              </AuthButton>

              <p className="text-blue-800 text-end text-sm">
                <Link href="/request-reset-password" className="hover:text-blue-500 ">
                  Esqueceu sua senha?
                </Link>
              </p>
            </form>

            <Link href="/login" className="mt-10">
              Já tem uma conta? <span className="text-blue-800 hover:text-blue-500">Entrar</span>
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
