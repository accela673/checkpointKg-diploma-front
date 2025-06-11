import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./OneHotelPage.scss";

// Типы
type Landlord = {
  id: number;
  name: string;
};

type Hotel = {
  id: number;
  name: string;
  type: string; 
  region: string;
  description: string;
  address: string;
  phoneNumber: string;
  telegram: string;
  twoGisURL: string;
  googleMapsURL: string;
  photos: string[];
  rooms: any[];
  availableRoomsCount: number;
  landlord: Landlord;
};

const OneHotelPage: React.FC = () => {
  const { t } = useTranslation();
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

  const typeLabels: Record<string, string> = {
    HOTEL: t("oneHotelPage.types.hotel"),
    HOSTEL: t("oneHotelPage.types.hostel"),
    APARTMENT: t("oneHotelPage.types.apartment"),
    HOUSE: t("oneHotelPage.types.house"),
    COTTAGE: t("oneHotelPage.types.cottage"),
    YURT: t("oneHotelPage.types.yurt"),
    ANOTHER: t("oneHotelPage.types.another"),
  };

  const getTypeLabel = (type: string): string => {
    return typeLabels[type] || type;
  };

  if (!hotel) return <div>{t("oneHotelPage.loading")}</div>;

  return (
    <div className="hotel-page">
      <h1 className="hotel-title">{hotel.name}</h1>

      <Link to={`/hotel-rooms/${hotel.id}`}>
        <button className="view-rooms-btn">
          {t("oneHotelPage.viewRooms")}
        </button>
      </Link>

      {+hotel.landlord.id === +userId! && (
        <Link to={`/add-room/${hotel.id}`}>
          <button className="add-room-btn">
            {t("oneHotelPage.addRoom")}
          </button>
        </Link>
      )}

      <div className="hotel-info">
        <div className="hotel-details">
          <p><strong>{t("oneHotelPage.type")}:</strong> {getTypeLabel(hotel.type)}</p>
          <p><strong>{t("oneHotelPage.region")}:</strong> {hotel.region}</p>          
          <p><strong>{t("oneHotelPage.totalRooms")}:</strong> {hotel.rooms.length}</p>
          <p><strong>{t("oneHotelPage.availableRooms")}:</strong> {hotel.availableRoomsCount}</p>
          <p><strong>{t("oneHotelPage.description")}:</strong> {hotel.description}</p>
          <p><strong>{t("oneHotelPage.address")}:</strong> {hotel.address}</p>
          <p><strong>{t("oneHotelPage.phone")}:</strong> <a href={`tel:${hotel.phoneNumber}`}>{hotel.phoneNumber}</a></p>
          <p><strong>{t("oneHotelPage.telegram")}:</strong> <a href={`https://t.me/${hotel.telegram}`} target="_blank" rel="noopener noreferrer">{hotel.telegram}</a></p>
          <p><strong>{t("oneHotelPage.twoGis")}:</strong> <a href={hotel.twoGisURL} target="_blank" rel="noopener noreferrer">{t("oneHotelPage.link")}</a></p>
          <p><strong>{t("oneHotelPage.googleMaps")}:</strong> <a href={hotel.googleMapsURL} target="_blank" rel="noopener noreferrer">{t("oneHotelPage.link")}</a></p>
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
