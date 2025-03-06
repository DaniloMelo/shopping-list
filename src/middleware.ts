import { NextRequest, NextResponse } from "next/server";
import TokenService from "./lib/TokenService";

const tokenService = new TokenService();

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("sessionToken")?.value;
  console.log("Token no middleware: ", sessionToken);
  if (!sessionToken) {
    console.log("Redirecionando para login: Token não encontrado");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await tokenService.verify(sessionToken);

    const response = NextResponse.next();
    response.headers.set("x-user-data", sessionToken);

    return response;
  } catch (error) {
    console.error("Erro ao verificar token no middleware: ", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ======

  // // Log todos os cookies recebidos
  // console.log("Todos os cookies recebidos:", req.cookies);

  // // Log do cookie específico de sessão
  // const sessionTokenCookie = req.cookies.get("sessionToken");
  // console.log("Cookie sessionToken:", sessionTokenCookie);

  // const sessionToken = sessionTokenCookie?.value;
  // console.log("Valor do token no middleware:", sessionToken);

  // if (!sessionToken) {
  //   console.log("Detalhes do redirecionamento:", {
  //     currentUrl: req.url,
  //     loginUrl: new URL("/login", req.url).toString(),
  //   });
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // try {
  //   await tokenService.verify(sessionToken);

  //   const response = NextResponse.next();
  //   response.headers.set("x-user-data", sessionToken);

  //   return response;
  // } catch (error) {
  //   console.error("Erro detalhado na verificação do token:", error);
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // =====

  //   // Log detalhado de todos os cabeçalhos e cookies
  //   console.log("Cabeçalho de Cookies Completo:", req.headers.get("cookie"));

  //   // Extração manual do token
  //   const cookieHeader = req.headers.get("cookie") || "";
  //   const sessionTokenMatch = cookieHeader.match(/sessionToken=([^;]+)/);
  //   const sessionToken = sessionTokenMatch ? sessionTokenMatch[1] : undefined;

  //   console.log("Token Extraído Manualmente:", sessionToken);

  //   // Se não encontrar o token, redirecione
  //   if (!sessionToken) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }

  //   try {
  //     // Tente verificar o token
  //     await tokenService.verify(sessionToken);

  //     // Se o token for válido, continue a requisição
  //     const response = NextResponse.next();
  //     response.headers.set("x-user-data", sessionToken);

  //     return response;
  //   } catch (error) {
  //     console.error("Erro na verificação do token:", error);
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }
  // }
}

export const config = {
  matcher: ["/"],
};
