import { PublicError } from "@/lib/CustomErrors";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useFetch } from "./useFetch";

export function useRequestResetPasswordFetch() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formErrorAction, setFormErrorAction] = useState("");
  const [formSuccess, setFormSucces] = useState("");

  const { fetchRequestResetPassword } = useFetch();
  const router = useRouter();

  useEffect(() => {
    if (!email.includes("@") || !email.includes(".com") || email.trim().length === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [email]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErrorMessage("");
    setFormErrorAction("");
    setFormSucces("");
    setIsLoading(true);
    setIsDisabled(true);

    try {
      const response = await fetchRequestResetPassword(email);

      if (!response.ok) {
        const ErrorData = await response.json();
        if (ErrorData.isPublicError) throw new PublicError(ErrorData.message, ErrorData.action);
      }

      setFormSucces("Email Enviado.");
      setIsLoading(false);
      setTimeout(() => router.push("/login"), 3000);
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

  return {
    email,
    setEmail,
    formErrorMessage,
    formErrorAction,
    formSuccess,
    isLoading,
    isDisabled,
    handleSubmit,
  };
}
