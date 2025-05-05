import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./OneHotelPage.scss";

// Типы
type Landlord = {
  id: number;
  name: string;
};

type Hotel = {
  id: number;
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  telegram: string;
  twoGisURL: string;
  googleMapsURL: string;
  photos: string[];
  rooms: any[]; // Можно уточнить типы, если известна структура
  availableRoomsCount: number;
  landlord: Landlord;
};

const OneHotelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const url = import.meta.env.VITE_URL;
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get<Hotel>(`${url}/api/hotels/one/${id}`);
        setHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
    };

    fetchHotelData();
  }, [id, url]);

  const handleImageClick = (image: string) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  if (!hotel) return <div>Loading...</div>;

  return (
    <div className="hotel-page">
      <h1 className="hotel-title">{hotel.name}</h1>

      <Link to={`/hotel-rooms/${hotel.id}`}>
        <button className="view-rooms-btn">
          Посмотреть свободные номера
        </button>
      </Link>

      {+hotel.landlord.id === +userId! && (
        <Link to={`/add-room/${hotel.id}`}>
          <button className="add-room-btn">
            Добавить номер
          </button>
        </Link>
      )}

      <div className="hotel-info">
        <div className="hotel-details">
          <p><strong>Всего комнат:</strong> {hotel.rooms.length}</p>
          <p><strong>Свободных комнат:</strong> {hotel.availableRoomsCount}</p>
          <p><strong>Описание:</strong> {hotel.description}</p>
          <p><strong>Адрес:</strong> {hotel.address}</p>
          <p><strong>Телефон:</strong> <a href={`tel:${hotel.phoneNumber}`}>{hotel.phoneNumber}</a></p>
          <p><strong>Telegram:</strong> <a href={`https://t.me/${hotel.telegram}`}>{hotel.telegram}</a></p>
          <p><strong>2Gis:</strong> <a href={hotel.twoGisURL} target="_blank" rel="noopener noreferrer">Ссылка на 2GIS</a></p>
          <p><strong>Google Maps:</strong> <a href={hotel.googleMapsURL} target="_blank" rel="noopener noreferrer">Ссылка на Google Maps</a></p>
        </div>

        <div className="hotel-images">
          {hotel.photos?.map((photo, index) => (
            <div className="hotel-image-thumbnail-wrapper" key={index}>
              <img
                src={photo}
                alt={`hotel-image-${index}`}
                className="hotel-image-thumbnail"
                crossOrigin="anonymous"
                onClick={() => handleImageClick(photo)}
              />
            </div>
          ))}
        </div>
      </div>

      {modalImage && (
        <div className="modal active" onClick={closeModal}>
          <img src={modalImage} alt="Modal" crossOrigin="anonymous" />
        </div>
      )}
    </div>
  );
};

export default OneHotelPage;
