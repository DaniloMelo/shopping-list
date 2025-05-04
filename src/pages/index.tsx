import { IoMdMenu } from "react-icons/io";
import FilterProducts from "@/components/FilterProducts";
import Menu from "@/components/Menu";
import CreateProductModal from "@/components/CreateProductModal";
import OpenCreateProductModalButton from "@/components/OpenCreateProductModalButton";
import { ProductProps } from "@/components/Product";
import ProductsList from "@/components/ProductsList";
import UpdateProductModal from "@/components/UpdateProductModal";
import calcTotal from "@/lib/calcTotal";
import getBaseUrl from "@/lib/getBaseUrl";
import TokenService from "@/lib/TokenService";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import useModal from "@/hooks/useModal";

const tokenService = new TokenService();

interface IHomeProps {
  shoppingList: ProductProps[];
  userEmail: string;
  userId: string;
}

export default function Home({ shoppingList, userEmail, userId }: IHomeProps) {
  const [search, setSearch] = useState("");
  const [updatedProducts, setUpdatedProducts] = useState<ProductProps[]>(shoppingList);
  const [menuOpen, setMenuOpen] = useState(false);
  const [total, setTotal] = useState("");

  const { toggleIsCreateProductModalOpen } = useModal();

  useEffect(() => {
    setTotal(calcTotal(updatedProducts));
  }, [updatedProducts]);

  return (
    <main className={`flex flex-col items-center`}>
      <Header userEmail={userEmail} />

      <span
        className={`self-start cursor-pointer mt-2 text-zinc-300 hover:text-zinc-400 xl:hidden ${menuOpen ? "opacity-0" : "opacity-100"}`}
        onClick={() => setMenuOpen(true)}
      >
        <IoMdMenu className="text-3xl text-lightTxt dark:text-darkTxt" />
      </span>

      <Menu userEmail={userEmail} isOpen={menuOpen} onMenuOpen={setMenuOpen} />

      <FilterProducts value={search} onSearchChange={setSearch} />

      <OpenCreateProductModalButton click={() => toggleIsCreateProductModalOpen(true)} desktopType />

      {updatedProducts.length === 0 ? (
        <div className="my-10">
          <p className="text-lightTxt dark:text-darkTxt">Sua lista de compras está vazia.</p>
        </div>
      ) : (
        <div className="flex items-end w-full px-2 gap-x-2 mt-4">
          <p className="text-xl font-[500] text-lightTxt dark:text-darkTxt">Total: </p>
          <span className="font-[500] text-lightTxt dark:text-darkTxt">{total}</span>
        </div>
      )}

      <ProductsList
        initialProducts={shoppingList}
        userId={userId}
        search={search}
        onUpdateProduct={setUpdatedProducts}
      />

      <OpenCreateProductModalButton click={() => toggleIsCreateProductModalOpen(true)} />

      <CreateProductModal userId={userId} />

      <UpdateProductModal userId={userId} />
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

    const fetchSessionTokenResponse = await fetch(`${baseUrl}/api/v1/auth/find-session-token`, {
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

    const fetchUserResponse = await fetch(`${baseUrl}/api/v1/auth/find-user/${payload.userId}`, {
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

    const fetchShoppingListResponse = await fetch(`${baseUrl}/api/v1/product/list-products/${payload.userId}`, {
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
        userId: fetchUserData.id,
      },
    };
  } catch (error) {
    console.error("Error on getServerSideProps home page: ", error);
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
};
