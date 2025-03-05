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

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // console.log("Cookies no getServerSideProps:", context.req.headers.cookie);
//   // console.log("Cookies parsed:", context.req.cookies);

//   // const sessionToken = context.req.cookies.sessionToken;
//   // console.log("Token de sessão no getServerSideProps:", sessionToken);

//   // // const sessionToken = context.req.headers["x-user-data"] as string;
//   // console.log("Token no getServerSideProps: ", sessionToken);
//   // if (!sessionToken) {
//   //   return {
//   //     redirect: { destination: "/login", permanent: false },
//   //   };
//   // }

//   // // const cookies = context.req.headers.cookie || "";
//   // const baseUrl = getBaseUrl();

//   // try {
//   //   const tokenFromCookieResult = await fetch(`${baseUrl}/api/v1/find-session-token`, {
//   //     headers: { cookie: sessionToken },
//   //   });
//   //   const tokenFromCookieData = await tokenFromCookieResult.json();
//   //   console.log("Token do cookie no getServerSideProps recurado do db ===> ", tokenFromCookieData); //
//   //   if (new Date() > new Date(tokenFromCookieData.expiresAt)) {
//   //     return {
//   //       redirect: { destination: "/login", permanent: false },
//   //     };
//   //   }

//   //   const payload = await tokenService.verify(tokenFromCookieData.token || "");

//   //   const fetchUserResponse = await fetch(`${baseUrl}/api/v1/find-user/${payload.userId}`);
//   //   const fetchUserData = await fetchUserResponse.json();

//   //   return {
//   //     props: { userId: fetchUserData.id, userEmail: fetchUserData.email },
//   //   };
//   // } catch (error) {
//   //   console.error("Erro no getServerSideProps: ", error);
//   //   return {
//   //     redirect: { destination: "/login", permanent: false },
//   //   };
//   // }

//   // ===

//   // Log detalhado dos cookies
//   console.log("Cookies Completos:", context.req.headers.cookie);
//   console.log("Cookies Parsed:", context.req.cookies);

//   // Extração manual do token
//   const cookieHeader = context.req.headers.cookie || "";
//   const sessionTokenMatch = cookieHeader.match(/sessionToken=([^;]+)/);
//   const sessionToken = sessionTokenMatch ? sessionTokenMatch[1] : undefined;

//   console.log("Token de Sessão Extraído:", sessionToken);

//   if (!sessionToken) {
//     return {
//       redirect: { destination: "/login", permanent: false },
//     };
//   }

//   try {
//     const payload = await tokenService.verify(sessionToken);

//     const baseUrl = getBaseUrl();
//     const fetchUserResponse = await fetch(`${baseUrl}/api/v1/find-user/${payload.userId}`);
//     const fetchUserData = await fetchUserResponse.json();

//     return {
//       props: { userId: fetchUserData.id, userEmail: fetchUserData.email },
//     };
//   } catch (error) {
//     console.error("Erro no getServerSideProps:", error);
//     return {
//       redirect: { destination: "/login", permanent: false },
//     };
//   }
// };

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Log detalhado dos cookies
    console.log("Cookies Completos:", context.req.headers.cookie);
    console.log("Cookies Parsed:", context.req.cookies);

    // Extração manual do token
    // const cookieHeader = context.req.headers.cookie || "";
    // const sessionTokenMatch = cookieHeader.match(/sessionToken=([^;]+)/);
    // const sessionToken = sessionTokenMatch ? decodeURIComponent(sessionTokenMatch[1]) : undefined;

    const allCookies = context.req.headers.cookie || "";
    const sessionToken = context.req.cookies.sessionToken;

    console.log("Token de Sessão Extraído:", sessionToken);

    // Verificação explícita do token
    if (!sessionToken) {
      console.log("Nenhum token encontrado, redirecionando para login");
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Verificação do token
    let payload;
    try {
      payload = await tokenService.verify(sessionToken);
      console.log("Payload do Token:", payload);
    } catch (verifyError) {
      console.error("Erro na verificação do token:", verifyError);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const baseUrl = getBaseUrl();

    // Busca o token de sessão
    const fetchSessionTokenResponse = await fetch(`${baseUrl}/api/v1/find-session-token`, {
      headers: {
        Cookie: allCookies,
        "Content-Type": "application/json",
      },
    });
    if (!fetchSessionTokenResponse.ok) {
      console.error("Erro ao buscar o token de sessão: ", await fetchSessionTokenResponse.text());
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Busca de usuário com tratamento de erro
    const fetchUserResponse = await fetch(`${baseUrl}/api/v1/find-user/${payload.userId}`, {
      headers: {
        Cookie: allCookies,
        "Content-Type": "application/json",
      },
    });

    console.log("Status da Resposta de Busca de Usuário:", fetchUserResponse.status);

    if (!fetchUserResponse.ok) {
      //console.error("Erro ao buscar usuário:", await fetchUserResponse.text());
      const responseData = await fetchUserResponse.json();
      console.error("Erro ao buscar usuário: ", responseData);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const fetchUserData = await fetchUserResponse.json();
    console.log("Dados do Usuário:", fetchUserData);

    return {
      props: {
        userId: fetchUserData.id,
        userEmail: fetchUserData.email,
      },
    };
  } catch (error) {
    console.error("Erro completo no getServerSideProps:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
