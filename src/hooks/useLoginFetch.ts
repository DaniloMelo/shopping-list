import { PublicError } from "@/lib/CustomErrors";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useFetch } from "./useFetch";

export function useLoginFetch() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formErrorAction, setFormErrorAction] = useState("");

  const { login } = useFetch();
  const router = useRouter();

  useEffect(() => {
    if (!user.email.includes("@") || !user.email.includes(".com") || user.password.length < 8) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [user]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErrorMessage("");
    setFormErrorAction("");
    setIsLoading(true);
    setIsDisabled(true);

    try {
      const response = await login(user);

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.isPublicError) throw new PublicError(errorData.message, errorData.action);
      }

      router.push("/");
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
    user,
    setUser,
    formErrorMessage,
    formErrorAction,
    isDisabled,
    isLoading,
    handleSubmit,
  };
}
