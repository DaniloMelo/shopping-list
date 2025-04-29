import { PublicError } from "@/lib/CustomErrors";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useFetch } from "./useFetch";

export function useExecuteResetPasswordFetch() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formErrorAction, setFormErrorAction] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const { executeResetPassword } = useFetch();
  const router = useRouter();

  useEffect(() => {
    if (password.length < 8 || passwordConfirmation.length < 8) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [password, passwordConfirmation]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErrorMessage("");
    setFormErrorAction("");
    setFormSuccess("");
    setIsLoading(true);
    setIsDisabled(true);

    try {
      const { token, email } = router.query;

      if (typeof token !== "string" || typeof email !== "string") {
        throw new Error("Invalid token or email");
      }

      const response = await executeResetPassword({ email, token, password, passwordConfirmation });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.isPublicError) throw new PublicError(errorData.message, errorData.action);
      }

      setFormSuccess("Senha Alterada. Aguarde...");
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

  return {
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    formErrorMessage,
    formErrorAction,
    formSuccess,
    isLoading,
    isDisabled,
    handleSubmit,
  };
}
