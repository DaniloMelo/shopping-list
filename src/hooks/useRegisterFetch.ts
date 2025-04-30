import { PublicError } from "@/lib/CustomErrors";
import { FormEvent, useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import { useRouter } from "next/router";

interface InewUser {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export function useRegisterFetch() {
  const [newUser, setNewUser] = useState<InewUser>({ name: "", email: "", password: "", passwordConfirmation: "" });
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formErrorAction, setFormErrorAction] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const { fetchRegister } = useFetch();
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErrorMessage("");
    setFormErrorAction("");
    setIsLoading(true);
    setIsDisabled(true);

    try {
      const response = await fetchRegister(newUser);

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.isPublicError) {
          throw new PublicError(errorData.message, errorData.action);
        }
      }

      setFormSuccess("Usuário Criado! Aguarde...");
      setIsLoading(false);
      setTimeout(() => router.push("/login"), 2000);
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
    newUser,
    setNewUser,
    isDisabled,
    isLoading,
    formErrorMessage,
    formErrorAction,
    formSuccess,
    handleSubmit,
  };
}
