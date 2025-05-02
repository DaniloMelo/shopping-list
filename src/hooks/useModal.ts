import ModalContext from "@/contexts/ModalContext";
import { useContext } from "react";

export default function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ProductProvider");
  }

  return context;
}
