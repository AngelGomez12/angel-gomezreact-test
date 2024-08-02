import { useEffect } from "react";
import ListProducts from "../components/ListProducts";
import { useAPIService } from "../services/utils";
import { productsStore } from "../store/products/products";
import { Product } from "../interfaces/products.interface";

export const Products = () => {
  const api = useAPIService("products");
  const setProducts = productsStore((state) => state.setProducts);
  useEffect(() => {
    const fetchProducts = async () => {
      await api.fetchData();
      setProducts(api.data as Product[]);
    };

    fetchProducts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ListProducts />
    </div>
  );
};
