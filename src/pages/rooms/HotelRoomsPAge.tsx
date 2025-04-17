import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./HotelRoomsPage.scss";

const HotelRoomsPage = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // Для отслеживания выбранного изображения
  const url = import.meta.env.VITE_URL;
  const userId = localStorage.getItem("id");
  const userRole = localStorage.getItem("role"); // Получаем роль пользователя (CLIENT или LANDLORD)
  const navigate = useNavigate();

  // Функция для бронирования
  const bookRoom = async (roomId) => {
    try {
      const token = localStorage.getItem("access_token"); // Получаем токен
      if (!token) {
        navigate("/login"); // Перенаправляем на страницу логина, если нет токена
      }  
      const response = await axios.put(
        `${url}/api/rooms/book/one/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Заабронировано!");
      setRooms(
        rooms.map((room) =>
          room.id === roomId ? { ...room, isBooked: true } : room
        )
      );
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
    }
  };

  // Функция для освобождения комнаты (для LANDLORD)
  const releaseRoom = async (roomId) => {
    try {
      const token = localStorage.getItem("access_token"); // Получаем токен
      if (!token) {
        navigate("/login"); // Перенаправляем на страницу логина, если нет токена
      }
      const response = await axios.put(
        `${url}/api/rooms/release/one/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Комната освобождена!");
      setRooms(
        rooms.map((room) =>
          room.id === roomId ? { ...room, isBooked: false } : room
        )
      );
    } catch (error) {
      console.error("Ошибка при освобождении комнаты:", error);
    }
  };

  // Обработчик для клика по изображению
  const handleImageClick = (image) => {
    setSelectedImage(image); // Устанавливаем выбранное изображение в состояние
  };

  const handleCloseModal = () => {
    setSelectedImage(null); // Закрываем модальное окно
  };

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`${url}/api/hotels/one/${hotelId}`);
        setHotel(response.data);
        setRooms(response.data.rooms); // Получаем комнаты отеля
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  if (!hotel) return <div>Loading...</div>;

  return (
    <div className="hotel-rooms-page">
      <h1 className="hotel-title">{hotel.name} - Комнаты</h1>

      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-item">
            <h2>Номер {room.number}</h2>
            <p><strong>Описание:</strong> {room.description}</p>
            <p><strong>Количество комнат:</strong> {room.roomsNumber}</p>

            {/* Список изображений */}
            <div className="room-images">
              {room.photos?.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`room-image-${index}`}
                  className="room-image"
                  crossOrigin="anonymous"
                  onClick={() => handleImageClick(photo)} // При клике на картинку вызываем функцию
                />
              ))}
            </div>

            {/* В зависимости от роли показываем кнопку */}
            {userRole === "LANDLORD" && hotel?.landlord?.id ? (
              // Если роль LANDLORD, показываем кнопку для освобождения комнаты
              <button
                className="release-room-btn"
                onClick={() => releaseRoom(room.id)} // Освобождение комнаты
              >
                Освободить
              </button>
            ) : (
              // Если роль CLIENT, показываем кнопку для бронирования
              !room.isBooked ? (
                <button
                  className="book-room-btn"
                  onClick={() => bookRoom(room.id)} // Бронирование комнаты
                >
                  Забронировать
                </button>
              ) : (
                <p>Этот номер забронирован</p>
              )
            )}
          </div>
        ))}
      </div>

      {/* Модальное окно для отображения картинки */}
      {selectedImage && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Big view"
              crossOrigin="anonymous"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelRoomsPage;