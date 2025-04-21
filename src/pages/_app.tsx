import Container from "@/components/Container";
import { ProductProvider } from "@/contexts/ProductContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ProductProvider>
        <Container>
          <Component {...pageProps} />
        </Container>
      </ProductProvider>
    </ThemeProvider>
  );
}
