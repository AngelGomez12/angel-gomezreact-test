export interface Product {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  id: string;
}

export interface ProductDetails {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  id: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface ProductsStore {
  products: Array<Product>;
  setProducts: (products: Array<Product>) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}
