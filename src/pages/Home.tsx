import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    checkSession(); // Проверка сессии при рендере компонента
  }, []); // Пустой массив зависимостей, чтобы запускалось только при первом рендере

  const checkSession = () => {
    const loginTime = localStorage.getItem("loginTime");

    if (loginTime) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - Number(loginTime);

      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах

      if (timeElapsed > twentyFourHours) {
        // Если прошло больше 24 часов, удаляем данные и выходим
        localStorage.clear();
        window.location.href = "/login"; // Перенаправляем на страницу логина
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Главная страница</h1>
      <p className="text-gray-600 mt-2">Добро пожаловать в Chekpoint.kg!</p>
    </div>
  );
};

export default Home;
