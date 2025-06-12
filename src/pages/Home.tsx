import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  const checkSession = () => {
    const loginTime = localStorage.getItem("loginTime");
    if (!loginTime) return;

    const currentTime = Date.now();
    const timeElapsed = currentTime - Number(loginTime);
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (timeElapsed > twentyFourHours) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">{t("home.title")}</h1>
      <p className="text-gray-600 mt-2">{t("home.welcome")}</p>
    </div>
  );
};

export default Home;