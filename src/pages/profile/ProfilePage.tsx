import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [hotels, setHotels] = useState<any[]>([]); // Состояние для списка отелей
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const url = import.meta.env.VITE_URL;
  const accessToken = localStorage.getItem('access_token'); // Получаем токен для авторизации

  // Запрос для получения списка отелей
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null); // Сброс ошибки перед запросом
      try {
        const response = await axios.get(`${url}/api/hotels/landlord`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setHotels(response.data); // Обновляем состояние с полученными отелями
      } catch (error) {
        setError('Ошибка при получении отелей'); // Обработка ошибок
        console.error('Ошибка при получении отелей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels(); // Запускаем запрос
  }, [url, accessToken]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Профиль</h2>
      
      {/* Кнопка для добавления нового отеля */}
      <div className="mt-6">
        <Link
          to="/add-hotel"
          className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 text-center block"
        >
          Добавить новый отель
        </Link>
      </div>

      {/* Список отелей */}
      <div className="mt-8">
        {loading && <p>Загрузка...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {hotels.length === 0 && !loading && !error && (
          <p>У вас нет добавленных отелей.</p>
        )}
      <h2 className="text-xl font-bold mb-4">Мои гостиницы</h2>

        <ul className="mt-4 space-y-4">
          {hotels.map((hotel) => (
            <li key={hotel.id} className="p-4 border rounded-md">
              <h3 className="text-lg font-bold">{hotel.name}</h3>
              <p>{hotel.description}</p>
              <p>Адрес: {hotel.address}</p>
              <p>Телефон: {hotel.phoneNumber}</p>
              <Link
                to={`/hotels/${hotel.id}`}
                className="text-blue-500 hover:underline"
              >
                Подробнее
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
