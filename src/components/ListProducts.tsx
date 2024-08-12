import { useEffect, useState } from "react";
import { Product } from "../interfaces/products.interface";
import {
  useAPIServiceDelete,
  useAPIServiceGet,
  useLocalStorageSet,
} from "../services/utils";
import { useNavigate } from "react-router-dom";
import { Search } from "./Search";
import { Modal } from "./Modal";
import { toast } from "react-toastify";
import CreateProductForm from "./CreateProductForm";
import { productsStore } from "../store/products/products";

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
  const setProducts = productsStore((state) => state.setProducts);
  const [, setProductsInLocal] = useLocalStorageSet("products", "");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectProduct, setSelectProduct] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchData({ order: sortOrder });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  useEffect(() => {
    setFilteredProducts(products);
    setProducts(products);
    setProductsInLocal(products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setIsDelete(true);
    setIsModalOpen(true);
    setProductId(id);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setProductId("");
    setIsDelete(false);
  };

  const confimedDelete = () => {
    if (productId) {
      deleteData(productId);
      setIsModalOpen(false);
      toast.success("Producto eliminado con éxito", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setProductId("");
    setIsDelete(false);
  };

  const editProduct = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    product: Product
  ) => {
    event.stopPropagation();
    setIsModalOpen(true);
    setIsEdit(true);
    setSelectProduct(product);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as "asc" | "desc");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between">
        <Search search={search} onSearch={onSearch} />
        <select
          name="sortOrder"
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="asc">Ascendiente</option>
          <option value="desc">Descendiente</option>
        </select>
      </div>
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
                    onClick={(event) => editProduct(event, product)}
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
      {isDelete && (
        <Modal isOpen={isModalOpen}>
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Eliminar articulo</h2>
            <p>Esta seguro que desea eliminar el articulo?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confimedDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isEdit && (
        <Modal isOpen={isModalOpen}>
          <CreateProductForm
            product={selectProduct}
            setModalOpen={setIsModalOpen}
            setIsEdit={setIsEdit}
          />
        </Modal>
      )}
    </div>
  );
};

export default ListProducts;
