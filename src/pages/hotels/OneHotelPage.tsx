import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./OneHotelPage.scss";

const OneHotelPage = () => {
  const { id } = useParams();  // Получаем id из URL
  const [hotel, setHotel] = useState(null);
  const [modalImage, setModalImage] = useState(null);  // Состояние для модального окна с изображением
  const url = import.meta.env.VITE_URL;  // URL для API

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`${url}/api/hotels/one/${id}`);
        setHotel(response.data);  // Сохраняем полученные данные о гостинице
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
    };

    fetchHotelData();
  }, [id]);

  const handleImageClick = (image) => {
    setModalImage(image);  // Открытие модального окна с изображением
  };

  const closeModal = () => {
    setModalImage(null);  // Закрытие модального окна
  };

  if (!hotel) {
    return <div>Loading...</div>;  // Пока данные не загружены
  }

  return (
    <div className="hotel-page">
      <h1 className="hotel-title">{hotel.name}</h1>

      <div className="hotel-info">
        {/* Информация справа */}
        <div className="hotel-details">
          <p><strong>Комнат:</strong> {hotel.rooms}</p>
          <p><strong>Описание:</strong> {hotel.description}</p>
          <p><strong>Адрес:</strong> {hotel.address}</p>
          <p><strong>Телефон:</strong> <a href={`tel:${hotel.phoneNumber}`}>{hotel.phoneNumber}</a></p>
          <p><strong>Telegram:</strong> <a href={`https://t.me/${hotel.telegram}`}>{hotel.telegram}</a></p>
          <p><strong>TwoGis:</strong> <a href={hotel.twoGisURL} target="_blank" rel="noopener noreferrer">Ссылка на 2GIS</a></p>
          <p><strong>Google Maps:</strong> <a href={hotel.googleMapsURL} target="_blank" rel="noopener noreferrer">Ссылка на Google Maps</a></p>
        </div>

        {/* Изображения слева в коробке */}
        <div className="hotel-images">
          {hotel.photos?.map((photo, index) => (
            <div className="hotel-image-thumbnail-wrapper" key={index}>
              <img
                src={photo}
                alt={`hotel-image-${index}`}
                className="hotel-image-thumbnail"
                crossOrigin="anonymous"
                onClick={() => handleImageClick(photo)}  // Открытие изображения в модальном окне
              />
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно с изображением */}
      {modalImage && (
        <div className="modal active" onClick={closeModal}>
          <img src={modalImage} alt="Modal" crossOrigin="anonymous" />
        </div>
      )}
    </div>
  );
};

export default OneHotelPage;
