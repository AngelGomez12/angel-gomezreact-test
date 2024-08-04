import { useEffect, useState } from "react";
import { Product } from "../interfaces/products.interface";
import { useAPIServiceDelete, useAPIServiceGet } from "../services/utils";
import { useNavigate } from "react-router-dom";
import { Search } from "./Search";
import { Modal } from "./Modal";
import { toast } from "react-toastify";

const ListProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const {
    data: products,
    loading,
    error,
    fetchData,
  } = useAPIServiceGet("products");
  const { deleteData } = useAPIServiceDelete("products");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const onSearch = (search: string) => {
    setSearch(search);
    const filteredProducts = products.filter((product: Product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const deleteProduct = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ): void => {
    event.stopPropagation();
    setIsModalOpen(true);
    setProductId(id);
  };

  const confimedDelete = () => {
    if (productId) {
      deleteData(productId);
      setIsModalOpen(false);
      toast("Producto eliminado con éxito", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setProductId("");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Search search={search} onSearch={onSearch} />
      <div className="container mx-auto p-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Titulo</th>
              <th className="py-2 px-4 border-b">Precio</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product: Product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/dashboard/products/${product.id}`)}
              >
                <td className="py-2 px-4 border-b">{product.title}</td>
                <td className="py-2 px-4 border-b">{product.price}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/products/${product.id}`)
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Editar
                  </button>
                </td>
                <td>
                  <button
                    onClick={(event) => deleteProduct(event, product.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          {currentPage > 3 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-4 py-2 rounded bg-blue-500 text-white"
              >
                1
              </button>
              {currentPage > 4 && <span className="px-4 py-2">...</span>}
            </>
          )}
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter(
              (page) =>
                page === currentPage ||
                (page >= currentPage - 2 && page <= currentPage + 2)
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={page === currentPage}
                className={`px-4 py-2 rounded ${
                  page === currentPage
                    ? "bg-blue-700 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {page}
              </button>
            ))}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-4 py-2">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-4 py-2 rounded bg-blue-500 text-white"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        title="Eliminar producto"
        message="¿Estas seguro de eliminar el producto?"
        onClose={() => setIsModalOpen(false)}
        onConfirm={confimedDelete}
      />
    </div>
  );
};

export default ListProducts;
