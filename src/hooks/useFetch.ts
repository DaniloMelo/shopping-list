import { InewUser } from "@/pages/register";

export function useFetch() {
  async function register(newUser: InewUser) {
    const response = await fetch("api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
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
    deleteProduct,
    logout,
  };
}
