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
        onSubmit={(values) => {
          setUser(values.email);
          toast.success("Usuario modificado con Exito");
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
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
