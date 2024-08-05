import { Formik } from "formik";
import { useLocalStorageGet, useLocalStorageSet } from "../services/utils";
import { useEffect } from "react";
import { toast } from "react-toastify";

const UserForm = () => {
  const user = useLocalStorageGet("user", {
    email: "",
    password: "",
  });
  const [, setUser] = useLocalStorageSet("user", "");
  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Modificar usuario</h1>
      <Formik
        initialValues={{
          email: user?.email || "",
          password: user?.password || "",
        }}
        validate={(values) => {
          const errors: Record<string, string> = {};
          if (!values.email) {
            errors.email = "Requerido";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = "Ingrese un email válido";
          }

          if (!values.password) {
            errors.password = "Requerido";
          }

          if (values.password.length < 6) {
            errors.password = "Debe tener al menos 6 caracteres";
          }

          if (values.password.length > 12) {
            errors.password = "Debe tener menos de 12 caracteres";
          }

          if (
            !(values.password.match(/[a-z]/) && values.password.match(/[A-Z]/))
          ) {
            errors.password =
              "Debe tener al menos una letra minúscula y una mayúscula";
          }

          if (!values.password.match(/\d+/)) {
            errors.password = "Debe tener al menos un número";
          }

          if (!values.password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
            errors.password = "Debe tener al menos un caracter especial";
          }

          return errors;
        }}
        onSubmit={(values) => {
          setUser({
            email: values.email,
            password: values.password,
          });
          toast.success("Usuario modificado con Exito");
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center"
          >
            <div className="flex flex-col justify-center">
              <label className="font-bold text-lg text-center">Email</label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className="rounded-lg border-2 p-3 m-2"
              />
              {errors.email && touched.email && errors.email}
              <label className="font-bold text-lg text-center">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="rounded-lg border-2 p-3 m-2"
              />
              {errors.password && touched.password && errors.password}
            </div>
            <button
              type="submit"
              className="px-14 py-2  bg-cyan-600 rounded-lg border-2 text-white"
            >
              Modificar Usuario
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default UserForm;
