interface InewUserData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface ILoginUserData {
  email: string;
  password: string;
}

interface IExecuteResetPassword {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
}

export function useFetch() {
  async function fetchRegister(newUser: InewUserData) {
    const response = await fetch("api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    return response;
  }

  async function fetchLogin(userData: ILoginUserData) {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    return response;
  }

  async function fetchLogout(userEmail: string) {
    await fetch("api/v1/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });
  }

  async function fetchRequestResetPassword(email: string) {
    const response = await fetch("api/v1/auth/request-reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return response;
  }

  async function fetchExecuteResetPassword({ email, token, password, passwordConfirmation }: IExecuteResetPassword) {
    const response = await fetch("api/v1/auth/execute-reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password, passwordConfirmation }),
    });

    return response;
  }

  async function deleteProduct(productId: string, userId: string) {
    await fetch(`/api/v1/product/delete-product/${productId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  }

  return {
    fetchRegister,
    fetchLogin,
    fetchLogout,
    fetchRequestResetPassword,
    fetchExecuteResetPassword,
    deleteProduct,
  };
}
