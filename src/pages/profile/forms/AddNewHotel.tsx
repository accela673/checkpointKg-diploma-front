import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AddHotelForm = () => {
  const { t } = useTranslation();

  const [hotelData, setHotelData] = useState({
    type: '',
    name: '',
    description: '',
    address: '',
    phoneNumber: '',
    twoGisURL: '',
    googleMapsURL: '',
    telegram: '',
    region: '',
    photos: [] as File[],
  });

  const url = import.meta.env.VITE_URL;
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHotelData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    setHotelData(prev => {
      const combinedFiles = [...prev.photos, ...newFiles];
      return {
        ...prev,
        photos: combinedFiles.slice(0, 10),
      };
    });
  };

  const handleRemoveFile = (index: number) => {
    setHotelData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('name', hotelData.name);
    formData.append('description', hotelData.description);
    formData.append('address', hotelData.address);
    formData.append('phoneNumber', hotelData.phoneNumber);
    formData.append('twoGisURL', hotelData.twoGisURL || '');
    formData.append('googleMapsURL', hotelData.googleMapsURL || '');
    formData.append('telegram', hotelData.telegram || '');
    formData.append('region', hotelData.region || '');

    hotelData.photos.forEach(file => {
      formData.append('photos', file);
    });

    try {
      await axios.post(`${url}/api/hotels/${hotelData.type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert(t('addHotel.success'));
      // window.location.reload();
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert(t('addHotel.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">{t('addHotel.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            {t('addHotel.typeLabel')}
          </label>
          <select
            id="type"
            name="type"
            value={hotelData.type}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">{t('addHotel.typePlaceholder')}</option>
            <option value="HOTEL">{t('addHotel.types.hotel')}</option>
            <option value="HOSTEL">{t('addHotel.types.hostel')}</option>
            <option value="APARTMENT">{t('addHotel.types.apartment')}</option>
            <option value="HOUSE">{t('addHotel.types.house')}</option>
            <option value="COTTAGE">{t('addHotel.types.cottage')}</option>
            <option value="YURT">{t('addHotel.types.yurt')}</option>
            <option value="ANOTHER">{t('addHotel.types.another')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            {t('addHotel.nameLabel')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={hotelData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder={t('addHotel.namePlaceholder')}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            {t('addHotel.descriptionLabel')}
          </label>
          <textarea
            id="description"
            name="description"
            value={hotelData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder={t('addHotel.descriptionPlaceholder')}
            required
          />
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            {t('addHotel.regionLabel')}
          </label>
          <select
            id="region"
            name="region"
            value={hotelData.region}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">{t('addHotel.regionPlaceholder')}</option>
            <option value="Бишкек">{t('regions.bishkek')}</option>
            <option value="Ош">{t('regions.osh')}</option>
            <option value="Чуйская область">{t('regions.chui')}</option>
            <option value="Ошская область">{t('regions.oshRegion')}</option>
            <option value="Иссык-Кульская область">{t('regions.issykKul')}</option>
            <option value="Нарынская область">{t('regions.naryn')}</option>
            <option value="Джалал-Абадская область">{t('regions.djalalAbad')}</option>
            <option value="Баткенская область">{t('regions.batken')}</option>
            <option value="Таласская область">{t('regions.talas')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            {t('addHotel.addressLabel')}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={hotelData.address}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder={t('addHotel.addressPlaceholder')}
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            {t('addHotel.phoneLabel')}
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={hotelData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder={t('addHotel.phonePlaceholder')}
            required
          />
        </div>

        <div>
          <label htmlFor="twoGisURL" className="block text-sm font-medium text-gray-700">
            {t('addHotel.twoGisLabel')}
          </label>
          <input
            type="text"
            id="twoGisURL"
            name="twoGisURL"
            value={hotelData.twoGisURL}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder={t('addHotel.twoGisPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="googleMapsURL" className="block text-sm font-medium text-gray-700">
            {t('addHotel.googleMapsLabel')}
          </label>
          <input
            type="text"
            id="googleMapsURL"
            name="googleMapsURL"
            value={hotelData.googleMapsURL}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder={t('addHotel.googleMapsPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
            {t('addHotel.telegramLabel')}
          </label>
          <input
            type="text"
            id="telegram"
            name="telegram"
            value={hotelData.telegram}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder={t('addHotel.telegramPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
            {t('addHotel.photosLabel')}
          </label>
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {hotelData.photos.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {hotelData.photos.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-full h-32 object-cover rounded shadow"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-white bg-opacity-80 text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-semibold rounded-md text-center block ${
            loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {loading ? t('addHotel.loading') : t('addHotel.submit')}
        </button>
      </form>
    </div>
  );
};

export default AddHotelForm;
