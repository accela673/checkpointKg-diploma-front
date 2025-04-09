import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SearchPage.scss";

const SearchPage = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [currentImages, setCurrentImages] = useState<{ [key: number]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Количество элементов на странице
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(`${url}/api/hotels/all`);
        setHotels(response.data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, []);

  const handleCardClick = (id: number) => {
    navigate(`/hotels/${id}`);
  };

  const handleImageSwitch = (hotelId: number, direction: "next" | "prev") => {
    setCurrentImages((prev) => {
      const currentIndex = prev[hotelId] || 0;
      const imagesLength = hotels.find((h) => h.id === hotelId)?.photos.length || 0;
      let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

      if (newIndex >= imagesLength) newIndex = 0;
      if (newIndex < 0) newIndex = imagesLength - 1;

      return {
        ...prev,
        [hotelId]: newIndex,
      };
    });
  };

  // Логика пагинации
  const indexOfLastHotel = currentPage * itemsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - itemsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="search-page">
      <h1 className="title">Поиск жилья</h1>
      <div className="card-list">
        {currentHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="hotel-card"
            onClick={() => handleCardClick(hotel.id)}
          >
            {hotel.photos?.length > 0 && (
              <div className="image-container" onClick={(e) => e.stopPropagation()}>
                <img
                  src={
                    hotel.photos[currentImages[hotel.id] || 0] ||
                    "https://via.placeholder.com/300"
                  }
                  alt="Hotel"
                  className="hotel-image"
                  crossOrigin="anonymous"
                />
                {hotel.photos.length > 1 && (
                  <>
                    <button
                      className="arrow left"
                      onClick={() => handleImageSwitch(hotel.id, "prev")}
                    ></button>
                    <button
                      className="arrow right"
                      onClick={() => handleImageSwitch(hotel.id, "next")}
                    ></button>
                  </>
                )}
              </div>
            )}
            <div className="card-content">
              <h2>{hotel.name}</h2>
              <p><strong>Комнат:</strong> {hotel.rooms}</p>
              <p><strong>Описание:</strong> {hotel.description}</p>
              <p><strong>Адрес:</strong> {hotel.address}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Назад
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastHotel >= hotels.length}
        >
          Вперёд
        </button>
      </div>
    </div>
  );
};

export default SearchPage;