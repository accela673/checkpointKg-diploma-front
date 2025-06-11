import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './NavbarMobile.scss';

const NavbarMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Получаем роль и токен из localStorage
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role");
    setAccessToken(token);
    setRole(userRole);
  }, []);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Закрываем меню при клике на ссылку
  };

  return (
    <div className="navbar-mobile">
      <div className="mobile-header">
        <Link to="/" className="logo">
          Chekpoint.kg
        </Link>
        <button className="hamburger" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18"></path>
          </svg>
        </button>
      </div>

      {/* Оверлей, который закрывает меню при клике */}
      {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}

      {/* Сайд-меню с анимацией закрытия */}
      <div className={`side-menu ${isMenuOpen ? "open" : "closed"}`}>
        <Link to="/" onClick={closeMenu}>Главная</Link>
        <Link to="/search" onClick={closeMenu}>Поиск жилья</Link>
        <Link to="/about" onClick={closeMenu}>О нас</Link>

        {/* Добавляем проверки на роль */}
        {role === "ADMIN" && <Link to="/admin" onClick={closeMenu}>Админ</Link>}
        {(role === "CLIENT" || role === "LANDLORD") && <Link to="/profile" onClick={closeMenu}>Профиль</Link>}

        <div className="auth-links">
          {!accessToken ? (
            <>
              <Link to="/login" onClick={closeMenu}>Вход</Link>
              <Link to="/register" className="button" onClick={closeMenu}>Регистрация</Link>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.clear();
                closeMenu()
                navigate('/')
                window.location.reload()
              }}
              className="button"
            >
              Выход
            </button>
          )}
        </div>
        <div className="mobile-footer">
          <p>Контакты:</p>
          <p>Тел: +996 704 022 832</p>
         <p>Email: localhokage81@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default NavbarMobile;