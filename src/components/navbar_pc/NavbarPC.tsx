import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./NavbarPC.scss";

const NavbarPC = () => {
  const { t, i18n } = useTranslation();
  const access_token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "ru");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  return (
    <nav className="navbar-pc">
      <div className="container">
        <Link to="/" className="logo">
          Chekpoint.kg
        </Link>

        <div className="nav-wrapper">
          <div className="nav-links">
            <select value={language} onChange={handleLanguageChange} className="lang-select">
              <option value="ru">Русский</option>
              <option value="kg">Кыргызча</option>
            </select>
            <Link to="/">{t("navbar.home")}</Link>
            <Link to="/search">{t("navbar.search")}</Link>
            <Link to="/about">{t("navbar.about")}</Link>
            <Link to="/contact">{t("navbar.contact")}</Link>
            {role === "ADMIN" && <Link to="/admin">{t("navbar.admin")}</Link>}
            {(role === "CLIENT" || role === "LANDLORD") && (
              <Link to="/profile">{t("navbar.profile")}</Link>
            )}
          </div>

          <div className="auth-links" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!access_token ? (
              <>
                <Link to="/login">{t("navbar.login")}</Link>
                <Link to="/register" className="button">
                  {t("navbar.register")}
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="button">
                {t("navbar.logout")}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPC;
