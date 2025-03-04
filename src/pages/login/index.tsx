import AuthButton from "@/components/AuthButton";
import AuthInput from "@/components/AuthInput";
import Logo from "@/components/Logo";
import { PublicError } from "@/lib/CustomErrors";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { IoIosMail } from "react-icons/io";
import { MdLock } from "react-icons/md";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formErrorAction, setFormErrorAction] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user.email.includes("@") || !user.email.includes(".com") || user.password.length < 8) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [user]);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErrorMessage("");
    setFormErrorAction("");
    setFormSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        //credentials: "include",
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.isPublicError) throw new PublicError(errorData.message, errorData.action);
      }

      setFormSuccess("Aguarde...");
      setUser({ email: "", password: "" });
      setIsDisabled(true);
      setIsLoading(false);
      console.log("Redirecionando para a home..."); //
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      if (error instanceof PublicError) {
        setFormErrorMessage(error.message);
        setFormErrorAction(error.action);
        setIsLoading(false);
        setIsDisabled(true);
        setTimeout(() => {
          setFormErrorMessage("");
          setFormErrorAction("");
          setIsDisabled(false);
        }, 5000);
      }
    }
  }

  return (
    <main className="h-screen flex justify-center items-center">
      <section className="flex flex-col justify-center items-center w-80 py-10">
        <Logo size="sm" />

        <h1 className="text-xl self-start mt-10 mb-5">Entrar</h1>

        <form className="w-full flex flex-col gap-5" onSubmit={handleFormSubmit}>
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

          {formSuccess && (
            <div className="bg-green-900/50 w-full p-5 mt-5 text-sm text-center rounded-md">
              <p>{formSuccess}</p>
            </div>
          )}

          <AuthButton label="Entrar" disabled={isDisabled} loading={isLoading} />

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
    </main>
  );
}
