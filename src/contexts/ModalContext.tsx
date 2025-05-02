import { createContext, ReactNode, useState } from "react";

interface IModalContext {
  isCreateProductModalOpen: boolean;
  toggleIsCreateProductModalOpen(value: boolean): void;
  isUpdateProductModalOpen: boolean;
  toggleIsUpdateProductModalOpen(value: boolean): void;
}

interface IModalProviderProps {
  children: ReactNode;
}

const ModalContext = createContext<IModalContext | undefined>(undefined);

export function ModalProvioder({ children }: IModalProviderProps) {
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] = useState(false);

  function toggleIsCreateProductModalOpen(value: boolean) {
    setIsCreateProductModalOpen(value);
  }

  function toggleIsUpdateProductModalOpen(value: boolean) {
    setIsUpdateProductModalOpen(value);
  }

  return (
    <ModalContext.Provider
      value={{
        isCreateProductModalOpen,
        toggleIsCreateProductModalOpen,
        isUpdateProductModalOpen,
        toggleIsUpdateProductModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
