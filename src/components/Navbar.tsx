import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Chekpoint.kg
        </Link>
        <div>
          <Link to="/login" className="text-white mr-4 hover:underline">
            Вход
          </Link>
          <Link to="/register" className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200">
            Регистрация
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
