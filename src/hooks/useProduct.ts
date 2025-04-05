import ProductContext from "@/contexts/ProductContext";
import { useContext } from "react";

export default function useProduct() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }

  return context;
}
