import Logo from "@/components/Logo";
import { MdPerson } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { MdLock } from "react-icons/md";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { PublicError } from "@/lib/CustomErrors";
import { useRouter } from "next/router";

interface InewUser {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function RegisterPage() {
  const [newUser, setNewUser] = useState<InewUser>({ name: "", email: "", password: "", passwordConfirmation: "" });
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formErrorAction, setFormErrorAction] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (
      newUser.name.length < 3 ||
      newUser.name.trim().length === 0 ||
      !newUser.email.includes("@") ||
      !newUser.email.includes(".com") ||
      newUser.password.length < 8 ||
      newUser.passwordConfirmation.length < 8
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [newUser]);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErrorMessage("");
    setFormErrorAction("");
    setIsLoading(true);

    try {
      const response = await fetch("api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.isPublicError) {
          throw new PublicError(errorData.message, errorData.action);
        }
      }

      setFormSuccess("Usuário Criado! Aguarde...");
      setNewUser({ name: "", email: "", password: "", passwordConfirmation: "" });
      setIsDisabled(true);
      setIsLoading(false);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      if (error instanceof PublicError) {
        setFormErrorMessage(error.message);
        setFormErrorAction(error.action);
        setIsLoading(false);
        setTimeout(() => {
          setFormErrorMessage("");
          setFormErrorAction("");
        }, 5000);
      }
    }
  }

  return (
    <main className="h-screen flex justify-center">
      <section className=" flex flex-col justify-center items-center w-80 py-10">
        <Logo size="sm" />

        <h1 className="text-xl self-start mt-10 mb-5">Cadastre-se</h1>

        <form className="w-full flex flex-col gap-5" onSubmit={handleFormSubmit}>
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

          <AuthButton label="Cadastrar" disabled={isDisabled} loading={isLoading} />

          <Link className="text-blue-800 hover:text-blue-500 text-end text-sm" href="/">
            Esqueceu sua senha?
          </Link>
        </form>

        <Link href="/login" className="mt-10">
          Já tem uma conta? <span className="text-blue-800 hover:text-blue-500">Entrar</span>
        </Link>
      </section>
    </main>
  );
}
