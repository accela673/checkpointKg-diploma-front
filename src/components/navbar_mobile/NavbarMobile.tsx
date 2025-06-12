import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './NavbarMobile.scss';

const NavbarMobile = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "ru");

  useEffect(() => {
    setAccessToken(localStorage.getItem("access_token"));
    setRole(localStorage.getItem("role"));
  }, []);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
    i18n.changeLanguage(selectedLang);
    closeMenu();
  };

  const handleLogout = () => {
    localStorage.clear();
    closeMenu();
    navigate('/');
    // window.location.reload();
  };

  return (
    <div className="navbar-mobile">
      <div className="mobile-header">
        <Link to="/" className="logo">
          Chekpoint.kg
        </Link>
        <button className="hamburger" onClick={toggleMenu} aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}>
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

      {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}

      <div className={`side-menu ${isMenuOpen ? "open" : "closed"}`}>
        {/* Селектор языка */}
        <div className="language-select px-4 pt-4 pb-2">
          <label htmlFor="language" className="block mb-1 text-gray-700">{t('navbar.language')}</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="lang-select-mobile"
          >
            <option value="ru">Русский</option>
            <option value="kg">Кыргызча</option>
          </select>
        </div>

        <nav className="menu-links px-4 py-2 flex flex-col gap-3">
          <Link to="/" onClick={closeMenu}>{t('navbar.home')}</Link>
          <Link to="/search" onClick={closeMenu}>{t('navbar.search')}</Link>
          <Link to="/about" onClick={closeMenu}>{t('navbar.about')}</Link>

          {role === "ADMIN" && <Link to="/admin" onClick={closeMenu}>{t('navbar.admin')}</Link>}
          {(role === "CLIENT" || role === "LANDLORD") && (
            <Link to="/profile" onClick={closeMenu}>{t('navbar.profile')}</Link>
          )}
        </nav>

        <div className="auth-links px-4 py-2 flex flex-col gap-2">
          {!accessToken ? (
            <>
              <Link to="/login" onClick={closeMenu}>{t('navbar.login')}</Link>
              <Link to="/register" className="button" onClick={closeMenu}>{t('navbar.register')}</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="button">
              {t('navbar.logout')}
            </button>
          )}
        </div>

        <div className="mobile-footer px-4 py-4 text-sm text-gray-600">
          <p>Тел: +996 704 022 832</p>
          <p>Email: localhokage81@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default NavbarMobile;
