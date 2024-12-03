import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Product {
  productName: string;
  image: string;
  price: number;
}

interface ProductContextType {
  product: Product;
  setProductInstall: React.Dispatch<React.SetStateAction<Product>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const getProductFromStorage = (): Product => {
  const storedProduct = localStorage.getItem('product');
  return storedProduct
    ? JSON.parse(storedProduct)
    : {
        productName: '',
        image: '',
        price: 0,
      };
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [product, setProductInstall] = useState<Product>(getProductFromStorage);

  useEffect(() => {
    localStorage.setItem('product', JSON.stringify(product));
  }, [product]);

  return (
    <ProductContext.Provider value={{ product, setProductInstall }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
