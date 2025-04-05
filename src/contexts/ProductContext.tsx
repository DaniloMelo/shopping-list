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
}

interface IProductProdiverProps {
  children: ReactNode;
}

const ProductContext = createContext<IProductContext | undefined>(undefined);

export function ProductProvider({ children }: IProductProdiverProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productToUpdate, setProductToUpdate] = useState<IProduct>();

  function addInitialProducts(initialProducts: IProduct[]) {
    setProducts(initialProducts);
  }

  function addProduct(product: IProduct) {
    setProducts((prevProduct) => [...prevProduct, product]);
  }

  function addProductToUpdate(product: IProduct) {
    setProductToUpdate(product);
  }

  return (
    <ProductContext.Provider
      value={{
        getAllProducts: products,
        addInitialProducts,
        addProduct,
        productToUpdate: addProductToUpdate,
        getProductToUpdate: productToUpdate!,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export default ProductContext;
