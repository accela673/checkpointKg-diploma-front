import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./SearchPage.scss";

const SearchPage = () => {
  const { t } = useTranslation();

  const [hotels, setHotels] = useState<any[]>([]);
  const [currentImages, setCurrentImages] = useState<{ [key: number]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;

  const typeLabels: Record<string, string> = {
    HOTEL: t("searchPage.types.hotel"),
    HOSTEL: t("searchPage.types.hostel"),
    APARTMENT: t("searchPage.types.apartment"),
    HOUSE: t("searchPage.types.house"),
    COTTAGE: t("searchPage.types.cottage"),
    YURT: t("searchPage.types.yurt"),
    ANOTHER: t("searchPage.types.another"),
  };

  const regions = [
    "",
    t("regions.bishkek"),
    t("regions.osh"),
    t("regions.chu"),
    t("regions.oshRegion"),
    t("regions.issykKul"),
    t("regions.naryn"),
    t("regions.djalalAbad"),
    t("regions.batken"),
    t("regions.talas"),
  ];

  const [regionFilter, setRegionFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegionFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  const types = ["", ...Object.keys(typeLabels)];

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
  }, [url]);

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

      return { ...prev, [hotelId]: newIndex };
    });
  };

  // Фильтрация и пагинация
  const indexOfLastHotel = currentPage * itemsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - itemsPerPage;

  const filteredHotels = hotels.filter((hotel) => {
    // Чтобы фильтрация по региону и типу работала корректно с переводами,
    // сравним их значения с исходными ключами:
    const regionKey = regions.findIndex((r) => r === hotel.region);
    const selectedRegionKey = regions.findIndex((r) => r === regionFilter);
    const matchesRegion = regionFilter ? regionFilter === hotel.region : true;

    const matchesType = typeFilter ? hotel.type === typeFilter : true;
    return matchesRegion && matchesType;
  });

  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="search-page">
      <h1 className="title">{t("searchPage.title")}</h1>
      <div className="filters">
        <select value={regionFilter} onChange={handleRegionChange} className="filter-select">
          <option value="">{t("searchPage.allRegions")}</option>
          {regions
            .filter((r) => r !== "")
            .map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
        </select>

        <select value={typeFilter} onChange={handleTypeChange} className="filter-select">
          <option value="">{t("searchPage.allTypes")}</option>
          {types
            .filter((type) => type !== "")
            .map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
        </select>
      </div>

      <div className="card-list">
        {currentHotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card" onClick={() => handleCardClick(hotel.id)}>
            {hotel.photos?.length > 0 && (
              <div className="image-container" onClick={(e) => e.stopPropagation()}>
                <img
                  src={hotel.photos[currentImages[hotel.id] || 0] || "https://via.placeholder.com/300"}
                  alt={hotel.name}
                  className="hotel-image"
                  crossOrigin="anonymous"
                />
                {hotel.photos.length > 1 && (
                  <>
                    <button className="arrow left" onClick={() => handleImageSwitch(hotel.id, "prev")} />
                    <button className="arrow right" onClick={() => handleImageSwitch(hotel.id, "next")} />
                  </>
                )}
              </div>
            )}
            <div className="card-content">
              <h2>{hotel.name}</h2>
              <p>
                <strong>{t("searchPage.rooms")}: </strong> {hotel.rooms.length}
              </p>
              <p>
                <strong>{t("searchPage.description")}: </strong> {hotel.description}
              </p>
              <p>
                <strong>{t("searchPage.address")}: </strong> {hotel.address}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          {t("searchPage.prev")}
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastHotel >= filteredHotels.length}
        >
          {t("searchPage.next")}
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
