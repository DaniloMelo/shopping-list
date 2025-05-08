import { createContext, ReactNode, useState } from "react";

interface IProduct {
  id: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
}

interface IProductContext {
  getAllProducts: IProduct[];
  addInitialProducts(initialProducts: IProduct[]): void;
  addProduct(product: IProduct): void;
  productToUpdate(product: IProduct): void;
  getProductToUpdate: IProduct;
  addProductToDelete(productId: string): void;
  removeProductToDele(productId: string): void;
  cleanProductsToDelete(): void;
  productsToDelete: string[];
}

interface IProductProdiverProps {
  children: ReactNode;
}

const ProductContext = createContext<IProductContext | undefined>(undefined);

export function ProductProvider({ children }: IProductProdiverProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productToUpdate, setProductToUpdate] = useState<IProduct>();
  const [productsToDelete, setProductsToDelete] = useState<string[]>([]);

  function addInitialProducts(initialProducts: IProduct[]) {
    setProducts(initialProducts);
  }

  function addProduct(product: IProduct) {
    setProducts((prevProduct) => [...prevProduct, product]);
  }

  function addProductToUpdate(product: IProduct) {
    setProductToUpdate(product);
  }

  function addProductToDelete(productId: string) {
    setProductsToDelete((prevProductId) => [...prevProductId, productId]);
  }

  function removeProductToDele(productId: string) {
    const updatedArr = productsToDelete.filter((item) => item !== productId);
    setProductsToDelete([...updatedArr]);
  }

  function cleanProductsToDelete() {
    setProductsToDelete([]);
  }

  return (
    <ProductContext.Provider
      value={{
        getAllProducts: products,
        addInitialProducts,
        addProduct,
        productToUpdate: addProductToUpdate,
        getProductToUpdate: productToUpdate!,
        addProductToDelete,
        removeProductToDele,
        cleanProductsToDelete,
        productsToDelete,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export default ProductContext;
