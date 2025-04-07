import { Link, useNavigate } from "react-router-dom";
import "./NavbarPC.scss";

const NavbarPC = () => {
  const access_token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar-pc">
      <div className="container">
        <Link to="/" className="logo">Chekpoint.kg</Link>

        <div className="nav-wrapper">
          <div className="nav-links">
            <Link to="/">Главная</Link>
            <Link to="/search">Поиск жилья</Link>
            <Link to="/about">О нас</Link>
            <Link to="/contact">Контакты</Link>
            {role === "ADMIN" && <Link to="/admin">Админ</Link>}
            {(role === "CLIENT" || role === "LANDLORD") && (
              <Link to="/profile">Профиль</Link>
            )}
          </div>

          <div className="auth-links">
            {!access_token ? (
              <>
                <Link to="/login">Вход</Link>
                <Link to="/register" className="button">Регистрация</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="button">Выход</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPC;
