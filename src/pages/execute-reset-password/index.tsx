import AuthButton from "@/components/AuthButton";
import AuthInput from "@/components/AuthInput";
import Logo from "@/components/Logo";
import { PublicError } from "@/lib/CustomErrors";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { MdLock } from "react-icons/md";

export default function ExecuteResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formErrorAction, setFormErrorAction] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (password.length < 8 || passwordConfirmation.length < 8) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [password, passwordConfirmation]);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setFormErrorMessage("");
    setFormErrorAction("");
    setFormSuccess("");

    try {
      const { token, email } = router.query;

      const response = await fetch("api/v1/auth/execute-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password, passwordConfirmation }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.isPublicError) throw new PublicError(errorData.message, errorData.action);
      }

      setFormSuccess("Senha Alterada. Aguarde...");
      setIsDisabled(true);
      setIsLoading(false);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      if (error instanceof PublicError) {
        setIsLoading(false);
        setFormErrorMessage(error.message);
        setFormErrorAction(error.action);
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
    <main className="h-screen flex justify-center">
      <section className="flex flex-col justify-center items-center w-80 py-10">
        <Logo size="md" />

        <h1 className="text-xl self-start mt-10 mb-5">Redefinicição de senha</h1>

        <form className="w-full flex flex-col gap-5" onSubmit={handleFormSubmit}>
          <AuthInput
            Icon={MdLock}
            placeholder="Nova Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <AuthInput
            Icon={MdLock}
            placeholder="Confirme a senha"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
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
            {isLoading ? "Alterando" : "Alterar"}
          </AuthButton>

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
