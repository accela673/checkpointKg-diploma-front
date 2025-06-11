import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./HotelRoomsPage.scss";

interface Room {
  id: string;
  number: string;
  description: string;
  roomsNumber: number;
  isBooked: boolean;
  photos: string[];
}

interface Hotel {
  id: string;
  name: string;
  rooms: Room[];
  landlord?: {
    id: string;
  };
}

const HotelRoomsPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { t } = useTranslation();
  const url = import.meta.env.VITE_URL;
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  const bookRoom = async (roomId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.put(
        `${url}/api/rooms/book/one/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(t("hotel.bookedSuccess"));
      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId ? { ...room, isBooked: true } : room
        )
      );
    } catch (error) {
      console.error(t("hotel.bookError"), error);
    }
  };

  const releaseRoom = async (roomId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.put(
        `${url}/api/rooms/release/one/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(t("hotel.releasedSuccess"));
      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId ? { ...room, isBooked: false } : room
        )
      );
    } catch (error) {
      console.error(t("hotel.releaseError"), error);
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`${url}/api/hotels/one/${hotelId}`);
        const hotelData: Hotel = response.data;
        setHotel(hotelData);
        setRooms(hotelData.rooms || []);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
    };

    if (hotelId) fetchHotelData();
  }, [hotelId]);

  if (!hotel) return <div>{t("common.loading")}</div>;

  return (
    <div className="hotel-rooms-page">
      <h1 className="hotel-title">{hotel.name} - {t("hotel.rooms")}</h1>

      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-item">
            <h2>{t("hotel.rooms")} {room.number}</h2>
            <p><strong>{t("hotel.description")}:</strong> {room.description}</p>
            <p><strong>{t("hotel.roomsNumber")}:</strong> {room.roomsNumber}</p>

            <div className="room-images">
              {room.photos?.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`room-image-${index}`}
                  className="room-image"
                  crossOrigin="anonymous"
                  onClick={() => handleImageClick(photo)}
                />
              ))}
            </div>

            {userRole === "LANDLORD" && hotel.landlord?.id ? (
              <button
                className="release-room-btn"
                onClick={() => releaseRoom(room.id)}
              >
                {t("hotel.release")}
              </button>
            ) : !room.isBooked ? (
              <button
                className="book-room-btn"
                onClick={() => bookRoom(room.id)}
              >
                {t("hotel.book")}
              </button>
            ) : (
              <p>{t("hotel.booked")}</p>
            )}
          </div>
        ))}
      </div>

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
