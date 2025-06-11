import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL;
  const accessToken = localStorage.getItem('access_token');

  const handleReleaseRoom = async (roomId: number) => {
    if (!accessToken) return;

    try {
      await axios.put(`${url}/api/rooms/release/one/${roomId}`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert(t('profilePage.releaseSuccess'));
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error('Ошибка при освобождении комнаты', error);
      alert(t('profilePage.releaseError'));
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);

    if (!accessToken) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (userRole === 'LANDLORD') {
          const response = await axios.get(`${url}/api/hotels/landlord`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setHotels(response.data);
        } else if (userRole === 'CLIENT') {
          const response = await axios.get(`${url}/api/rooms/all/my`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setRooms(response.data);
        }
      } catch (error) {
        setError(t('profilePage.errorLoading'));
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, accessToken, t]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">{t('profilePage.title')}</h2>

      {role === 'LANDLORD' && (
        <div className="mt-6">
          <Link
            to="/add-hotel"
            className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 text-center block"
          >
            {t('profilePage.addHotel')}
          </Link>
        </div>
      )}

      <div className="mt-8">
        {loading && <p>{t('profilePage.loading')}</p>}
        {error && <p className="text-red-500">{error}</p>}

        {role === 'LANDLORD' && (
          <>
            <h2 className="text-xl font-bold mb-4">{t('profilePage.myHotelsTitle')}</h2>
            {hotels.length === 0 && !loading && !error ? (
              <p>{t('profilePage.noHotels')}</p>
            ) : (
              <ul className="space-y-4">
                {hotels.map((hotel) => (
                  <li key={hotel.id} className="p-4 border rounded-md">
                    <h3 className="text-lg font-bold">{hotel.name}</h3>
                    <p>{hotel.description}</p>
                    <p>
                      {t('profilePage.address')}: {hotel.address}
                    </p>
                    <p>
                      {t('profilePage.phone')}: {hotel.phoneNumber}
                    </p>
                    <Link to={`/hotels/${hotel.id}`} className="text-blue-500 hover:underline">
                      {t('profilePage.details')}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {role === 'CLIENT' && (
          <>
            <h2 className="text-xl font-bold mb-4">{t('profilePage.myBookingsTitle')}</h2>
            {rooms.length === 0 && !loading && !error ? (
              <p>{t('profilePage.noBookings')}</p>
            ) : (
              <ul className="space-y-4">
                {rooms.map((room) => (
                  <li
                    key={room.id}
                    onClick={() => navigate(`/hotels/${room.hotel.id}`)}
                    className="p-4 border rounded-md cursor-pointer hover:shadow-md transition relative flex flex-col justify-between"
                  >
                    {room.photos && room.photos.length > 0 && (
                      <img
                        src={room.photos[0]}
                        crossOrigin="anonymous"
                        alt="Фото комнаты"
                        className="w-full h-48 object-cover rounded-md mb-2"
                      />
                    )}
                    <h3 className="text-lg font-semibold mb-1">
                      {t('profilePage.roomNumber', { number: room.number })}
                    </h3>
                    <p className="text-gray-700 mb-1">
                      {t('profilePage.description')}: {room.description}
                    </p>
                    <p className="text-gray-700 mb-1">
                      {t('profilePage.roomsCount')}: {room.roomsNumber}
                    </p>
                    <p className="text-gray-700 mb-1">
                      {t('profilePage.hotel')}: {room.hotel.name}
                    </p>
                    <p className="text-gray-700">
                      {t('profilePage.address')}: {room.hotel.address}
                    </p>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReleaseRoom(room.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 hover:opacity-90 text-white text-sm px-4 py-2 rounded-md transition duration-200 shadow-md"
                      >
                        {t('profilePage.releaseButton')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
