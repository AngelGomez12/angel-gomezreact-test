import { Link, Outlet } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div className="flex">
      <div className="w-1/6 h-screen text-white p-4 bg-sky-600">
        <ul className="list-none gap-10">
          <Link to="/dashboard/products">
            <li className="p-4 pl-8 hover:bg-sky-700">Productos</li>
          </Link>
          <Link to="/dashboard/products/create">
            <li className="p-4 pl-8 hover:bg-sky-700">Crear Producto</li>
          </Link>
          <Link to="/dashboard/users">
            <li className="p-4 pl-8 hover:bg-sky-700">Usuarios</li>
          </Link>
        </ul>
      </div>
      <div className="flex justify-center items-center w-3/4 p-4">
        <Outlet />
      </div>
    </div>
  );
};
