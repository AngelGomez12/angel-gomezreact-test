export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface ProductsStore {
  products: Array<Product>;
  setProducts: (products: Array<Product>) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}
