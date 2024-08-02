import { Formik } from "formik";
import { authStore } from "../store/auth/auth";
import { useNavigate } from "react-router-dom";
import { generateToken, useLocalStorageSet } from "../services/utils";

const LoginForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = authStore((state: any) => state.login);
  const navigate = useNavigate();
  const [, setToken] = useLocalStorageSet("token", "");

  return (
    <div className="flex flex-col justify-center items-center h-[50rem] w-[41rem] p-36 border-solid border-2 rounded-lg shadow-md">
      <div>
        <h1 className="font-bold text-3xl mb-10">Login</h1>
      </div>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validate={(values) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const errors: any = {};
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
            errors.password = "Debe tener al menos 8 caracteres";
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

          if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden";
          }

          return errors;
        }}
        onSubmit={(values, actions) => {
          login();
          console.log(values);
          const newToken = generateToken();
          setToken(newToken);
          actions.setSubmitting(false);
          navigate("/dashboard");
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
            <label className="font-bold text-lg">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              className="rounded-lg border-2 p-3 m-2"
            />
            {errors.email && touched.email && errors.email}
            <label className="font-bold text-lg">Contraseña</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              className="rounded-lg border-2 p-3 m-2"
            />
            {errors.password && touched.password && errors.password}
            <label className="font-bold text-lg">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmPassword}
              className="rounded-lg border-2 p-3 m-2"
            />
            {errors.confirmPassword &&
              touched.confirmPassword &&
              errors.confirmPassword}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-14 py-2  bg-cyan-600 rounded-lg border-2 text-white"
            >
              Enviar
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
