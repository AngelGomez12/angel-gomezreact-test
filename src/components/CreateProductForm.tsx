import { Formik } from "formik";
import {
  useAPIServicePost,
  useAPIServicePut,
  useLocalStorageSet,
} from "../services/utils";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { productsStore } from "../store/products/products";

interface CreateProductFormProps {
  product?: {
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
    id: string;
  } | null;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  product,
  setModalOpen,
  setIsEdit,
}) => {
  const [, setImageStorage] = useLocalStorageSet("image", "");
  const [image, setImage] = useState<string>(product?.image || "");
  const { postData } = useAPIServicePost("products");
  const { putData } = useAPIServicePut("products");
  const addProduct = productsStore((state) => state.addProduct);

  useEffect(() => {
    if (product?.image) {
      setImage(product.image);
    }
  }, [product]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    handleChange(event);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setImageStorage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-[50rem] w-[41rem] p-36 border-solid border-2 rounded-lg shadow-md bg-slate-50">
      <div>
        <h1 className="font-bold text-3xl mb-10">Crear Producto</h1>
      </div>
      <Formik
        initialValues={{
          title: product?.title || "",
          price: product?.price || 0,
          description: product?.description || "",
          image: "",
          category: product?.category || "",
        }}
        validate={(values) => {
          const errors: Record<string, string> = {};
          if (!values.title) {
            errors.title = "Requerido";
          }
          if (!values.price) {
            errors.price = "Requerido";
          }
          if (!values.description) {
            errors.description = "Requerido";
          }
          if (!product && !values.image) {
            errors.image = "Requerido";
          }
          if (!values.category) {
            errors.category = "Requerido";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          console.log(values);
          if (!product) {
            setSubmitting(false);
            const productData = { ...values, id: "" };
            try {
              addProduct(productData);
              const response = await postData(productData);
              console.log(response);
              toast.success("Producto creado con exito", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            } catch (error) {
              console.log(error);
              toast.error("Error al crear producto", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            } finally {
              setSubmitting(false);
            }
          } else {
            setSubmitting(false);
            const productData = { ...values, id: product.id };
            try {
              const response = await putData(productData);
              console.log(response);
              setModalOpen ? setModalOpen(false) : null;
              setIsEdit ? setIsEdit(false) : null;
              toast.success("Producto editado con exito", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            } catch (error) {
              console.log(error);
              toast.error("Error al editar producto", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            } finally {
              setSubmitting(false);
            }
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="flex justify-center items-center flex-col gap-4"
          >
            <div className="flex">
              <div className="flex flex-col items-center">
                <label className="font-bold text-lg">Titulo</label>
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  className="rounded-lg border-2 p-3 m-2"
                />
                {errors.title && touched.title && errors.title}
              </div>
              <div className="flex flex-col items-center">
                <label className="font-bold text-lg">Precio</label>
                <input
                  type="number"
                  name="price"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.price}
                  className="rounded-lg border-2 p-3 m-2"
                />
                {errors.price && touched.price && errors.price}
              </div>
            </div>
            <label className="font-bold text-lg">Descripcion</label>
            <textarea
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              rows={5}
              cols={50}
              className="rounded-lg border-2 p-3 m-2"
            />
            {errors.description && touched.description && errors.description}
            <label className="font-bold text-lg">Imagen</label>
            <div className="flex">
              <input
                type="file"
                name="image"
                onChange={(event) => handleImageChange(event, handleChange)}
                onBlur={handleBlur}
                className="rounded-lg border-2 p-3 m-2"
              />
              {image && <img src={image} alt="product" className="w-20 h-20" />}
            </div>
            {errors.image && touched.image && errors.image}
            <label className="font-bold text-lg">Categoria</label>
            <input
              type="text"
              name="category"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.category}
              className="rounded-lg border-2 p-3 m-2"
            />
            {errors.category && touched.category && errors.category}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-14 py-2  bg-cyan-600 rounded-lg border-2 text-white"
            >
              {product ? "Editar Producto" : "Crear Producto"}
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default CreateProductForm;
