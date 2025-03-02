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
  const sessionToken = context.req.headers["x-user-data"] as string;
  if (!sessionToken) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const cookies = context.req.headers.cookie || "";
  console.log("COOKIE DO GSSP ==> ", cookies);
  const baseUrl = getBaseUrl();

  try {
    const tokenFromCookieResult = await fetch(`${baseUrl}/api/v1/find-session-token`, {
      headers: { cookie: cookies },
    });
    const tokenFromCookieData = await tokenFromCookieResult.json();
    if (new Date(tokenFromCookieData.expiresAt) < new Date()) {
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

    const payload = await tokenService.verify(tokenFromCookieData.token || "");

    const fetchUserResponse = await fetch(`${baseUrl}/api/v1/find-user/${payload.userId}`);
    const fetchUserData = await fetchUserResponse.json();

    return {
      props: { userId: fetchUserData.id, userEmail: fetchUserData.email },
    };
  } catch {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
};
