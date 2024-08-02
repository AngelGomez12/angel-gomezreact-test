import { useEffect } from "react";
import { productsStore } from "../store/products/products";

const ListProducts = () => {
  const products = productsStore((state) => state.products);
  useEffect(() => {
    console.log("Products:", products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <p>{product.name}</p>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ListProducts;
