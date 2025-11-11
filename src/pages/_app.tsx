import { ModalProvioder } from "@/contexts/ModalContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvioder>
      <ThemeProvider>
        <ProductProvider>
          <Component {...pageProps} />
        </ProductProvider>
      </ThemeProvider>
    </ModalProvioder>
  );
}
