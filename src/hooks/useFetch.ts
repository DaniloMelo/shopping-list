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

interface IFetchCreateProduct {
  productName: string;
  productPrice: number;
  productQuantity: number;
}

interface product {
  id: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
}

interface IFetchUpdateProduct {
  userId: string;
  product: product;
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

  async function fetchCreateProduct(product: IFetchCreateProduct) {
    const response = await fetch(`/api/v1/product/create-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName: product.productName,
        productPrice: product.productPrice,
        productQuantity: product.productQuantity,
      }),
    });

    return response;
  }

  async function fetchUpdateProduct({ userId, product }: IFetchUpdateProduct) {
    const response = await fetch("/api/v1/product/update-product", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        productId: product.id,
        productName: product.productName,
        productPrice: product.productPrice,
        productQuantity: product.productQuantity,
      }),
    });

    return response;
  }

  async function fetchDeleteProduct(productId: string) {
    await fetch(`/api/v1/product/delete/one/${productId}`, {
      method: "DELETE",
    });
  }

  return {
    fetchRegister,
    fetchLogin,
    fetchLogout,
    fetchRequestResetPassword,
    fetchExecuteResetPassword,
    fetchCreateProduct,
    fetchUpdateProduct,
    fetchDeleteProduct,
  };
}
