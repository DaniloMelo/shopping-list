import { createContext, ReactNode, useState } from "react";

interface IModalContext {
  isCreateProductModalOpen: boolean;
  toggleIsCreateProductModalOpen(value: boolean): void;
}

interface IModalProviderProps {
  children: ReactNode;
}

const ModalContext = createContext<IModalContext | undefined>(undefined);

export function ModalProvioder({ children }: IModalProviderProps) {
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);

  function toggleIsCreateProductModalOpen(value: boolean) {
    setIsCreateProductModalOpen(value);
  }

  return (
    <ModalContext.Provider value={{ isCreateProductModalOpen, toggleIsCreateProductModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
