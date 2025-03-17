import FilterProducts from "@/components/FilterProducts";
import { ProductProps } from "@/components/Product";
import ProductsList from "@/components/ProductsList";
import filterProducts from "@/lib/filterProducts";
import getBaseUrl from "@/lib/getBaseUrl";
import TokenService from "@/lib/TokenService";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const tokenService = new TokenService();

interface IHomeProps {
  shoppingList: ProductProps[];
  userEmail: string;
}

export default function Home({ shoppingList, userEmail }: IHomeProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredProducts = filterProducts(search, shoppingList);

  async function handleLogout() {
    await fetch("api/v1/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });

    router.push("/login");
  }

  return (
    <main className="flex flex-col items-center">
      <FilterProducts value={search} onSearchChange={setSearch} />

      <ProductsList shoppingList={filteredProducts} />

      <button onClick={handleLogout} className="border">
        Sair
      </button>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const allCookies = context.req.headers.cookie || "";
    const sessionToken = context.req.cookies.sessionToken;

    if (!sessionToken) {
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

    let payload;

    try {
      payload = await tokenService.verify(sessionToken);
    } catch (verifyError) {
      console.error("Token verification error: ", verifyError);
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

    const baseUrl = getBaseUrl();

    const fetchSessionTokenResponse = await fetch(`${baseUrl}/api/v1/find-session-token`, {
      headers: {
        Cookie: allCookies,
        "Content-Type": "application/json",
      },
    });

    if (!fetchSessionTokenResponse.ok) {
      console.error("Error during fetch session token: ", await fetchSessionTokenResponse.text());
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

    const fetchSessionTokenData = await fetchSessionTokenResponse.json();

    if (new Date(fetchSessionTokenData.expiresAt) < new Date()) {
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

    const fetchUserResponse = await fetch(`${baseUrl}/api/v1/find-user/${payload.userId}`, {
      headers: {
        Cookie: allCookies,
        "Content-Type": "application/json",
      },
    });

    if (!fetchUserResponse.ok) {
      console.error("Error during fetch user: ", await fetchUserResponse.text());
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

    const fetchUserData = await fetchUserResponse.json();

    const fetchShoppingListResponse = await fetch(`${baseUrl}/api/v1/list-products/${payload.userId}`, {
      headers: {
        Cookie: allCookies,
        "Content-Type": "application/json",
      },
    });

    if (!fetchShoppingListResponse.ok) {
      console.error("Error during fetch shoppingList");
    }

    const fetchShoppingListData = await fetchShoppingListResponse.json();

    return {
      props: {
        shoppingList: fetchShoppingListData,
        userEmail: fetchUserData.email,
      },
    };
  } catch (error) {
    console.error("Error on getServerSideProps home page: ", error);
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
};
