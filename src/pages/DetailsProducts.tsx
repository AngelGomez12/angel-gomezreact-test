import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAPIServiceGet } from "../services/utils";
import { ProductDetails } from "../interfaces/products.interface";

const DetailsProducts = () => {
  const params = useParams();
  const {
    data: product,
    loading,
    error,
    fetchData,
  } = useAPIServiceGet(`products/${params.id}`);
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    title: "",
    price: 0,
    description: "",
    image: "",
    category: "",
    id: "",
    rating: {
      rate: 0,
      count: 0,
    },
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (product && typeof product === "object" && !Array.isArray(product)) {
      setProductDetails(product);
    }
  }, [product]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <h1>Product Details</h1>
      <img
        src={productDetails.image}
        alt={productDetails.title}
        className="w-60 h-60 object-contain"
      />
      <p>
        <strong>Title:</strong> {productDetails.title}
      </p>
      <p>
        <strong>Price:</strong> {productDetails.price}
      </p>
      <p>
        <strong>Category:</strong> {productDetails.category}
      </p>
      <div className="w-[60rem]">
        <p>
          <strong>Description:</strong> {productDetails.description}
        </p>
      </div>
    </div>
  );
};

export default DetailsProducts;
