import getBaseUrl from "@/lib/getBaseUrl";
import TokenService from "@/lib/TokenService";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

const tokenService = new TokenService();

interface IHomeProps {
  userId: string;
  userEmail: string;
}

export default function Home(props: IHomeProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("api/v1/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: props.userEmail }),
    });

    router.push("/login");
  }

  return (
    <main>
      <h1>Home page</h1>

      <p>{props.userId}</p>

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

    return {
      props: {
        userId: fetchUserData.id,
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
