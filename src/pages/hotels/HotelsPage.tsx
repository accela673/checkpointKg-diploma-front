import { useEffect, useState } from "react";
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

  const typeLabels: Record<string, string> = {
  HOTEL: 'Отель',
  HOSTEL: 'Хостел',
  APARTMENT: 'Квартира',
  HOUSE: 'Дом',
  COTTAGE: 'Коттедж',
  YURT: 'Юрта',
  ANOTHER: 'Другое',
  };

  const regions = [
    '',
    'Бишкек',
    'Ош',
    'Чуйская область',
    'Ошская область',
    'Иссык-Кульская область',
    'Нарынская область',
    'Джалал-Абадская область',
    'Баткенская область',
    'Таласская область',
  ];

const [regionFilter, setRegionFilter] = useState<string>(""); // пустая — значит "все регионы"
const [typeFilter, setTypeFilter] = useState<string>("");

const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setRegionFilter(e.target.value);
  setCurrentPage(1); // сбросить на первую страницу при фильтрации
};

const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setTypeFilter(e.target.value);
  setCurrentPage(1);
};

const types = ['', ...Object.keys(typeLabels)];
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
  const filteredHotels = hotels.filter(hotel => {
  const matchesRegion = regionFilter ? hotel.region === regionFilter : true;
  const matchesType = typeFilter ? hotel.type === typeFilter : true;
  return matchesRegion && matchesType;
});

const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);


  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="search-page">
      <h1 className="title">Поиск жилья</h1>
      <div className="filters">
        <select
          value={regionFilter}
          onChange={handleRegionChange}
          className="filter-select"
        >
          <option value="">Все регионы</option>
          {regions
            .filter((r) => r !== "")
            .map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
        </select>

        <select
          value={typeFilter}
          onChange={handleTypeChange}
          className="filter-select"
        >
          <option value="">Все типы</option>
          {types
            .filter((t) => t !== "")
            .map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
        </select>
      </div>
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
              <p><strong>Номеров:</strong> {hotel.rooms.length}</p>
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