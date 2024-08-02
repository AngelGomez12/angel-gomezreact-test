import { create } from "zustand";
import { Product, ProductsStore } from "../../interfaces/products.interface";

export const productsStore = create<ProductsStore>((set) => ({
  products: [],
  setProducts: (newProducts: Product[]) => {
    console.log("newProducts:", newProducts);
    set((state) => ({
      products: Array.isArray(newProducts)
        ? [...state.products, ...newProducts]
        : state.products,
    }));
  },
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
}));
