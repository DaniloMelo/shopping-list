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

export function useFetch() {
  async function register(newUser: InewUserData) {
    const response = await fetch("api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    return response;
  }

  async function login(userData: ILoginUserData) {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    return response;
  }

  async function logout(userEmail: string) {
    await fetch("api/v1/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });
  }

  async function deleteProduct(productId: string, userId: string) {
    await fetch(`/api/v1/product/delete-product/${productId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  }

  return {
    register,
    login,
    deleteProduct,
    logout,
  };
}
