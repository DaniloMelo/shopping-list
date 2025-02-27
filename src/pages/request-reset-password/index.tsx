import AuthButton from "@/components/AuthButton";
import AuthInput from "@/components/AuthInput";
import Logo from "@/components/Logo";
import { PublicError } from "@/lib/CustomErrors";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { IoIosMail } from "react-icons/io";

export default function RequestResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formErrorAction, setFormErrorAction] = useState("");
  const [formSuccess, setFormSucces] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!email.includes("@") || !email.includes(".com") || email.trim().length === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [email]);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setFormErrorMessage("");
    setFormErrorAction("");
    setFormSucces("");

    try {
      const response = await fetch("api/v1/request-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const ErrorData = await response.json();
        if (ErrorData.isPublicError) throw new PublicError(ErrorData.message, ErrorData.action);
      }

      setFormSucces("Email Enviado.");
      setEmail("");
      setIsLoading(false);
      setIsDisabled(true);
      setTimeout(() => router.push("/login"), 3000);
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
      <section className="flex flex-col justify-center items-center w-80 py-10">
        <Logo size="sm" />

        <h1 className="text-xl self-start mt-10 mb-5">Redefinicição de senha</h1>

        <p className="text-sm text-zinc-400 mb-10">
          Caso tenha um usuário cadastrado e válido, receberá um email com instruções de como redefinir a sua senha.
        </p>

        <form className="w-full flex flex-col gap-5" onSubmit={handleFormSubmit}>
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

          <AuthButton label="Enviar" loading={isLoading} disabled={isDisabled} />

          <p className="text-blue-800 text-end text-sm">
            <Link href="/login" className="hover:text-blue-500 ">
              Voltar para o login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
