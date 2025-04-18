import React, { useState } from 'react';
import axios from 'axios';

const AddHotelForm = () => {
  const [hotelData, setHotelData] = useState({
    name: '',
    description: '',
    address: '',
    phoneNumber: '',
    twoGisURL: '',
    googleMapsURL: '',
    telegram: '',
    photos: [] as File[],
  });
  const url = import.meta.env.VITE_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotelData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    setHotelData((prevData) => {
      const combinedFiles = [...prevData.photos, ...newFiles];
      return {
        ...prevData,
        photos: combinedFiles.slice(0, 10), // Ограничим до 10 файлов
      };
    });
  };

  const handleRemoveFile = (index: number) => {
    setHotelData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', hotelData.name);
    formData.append('description', hotelData.description);
    formData.append('address', hotelData.address);
    formData.append('phoneNumber', hotelData.phoneNumber);
    formData.append('twoGisURL', hotelData.twoGisURL || '');
    formData.append('googleMapsURL', hotelData.googleMapsURL || '');
    formData.append('telegram', hotelData.telegram || '');

    hotelData.photos.forEach((file) => {
      formData.append('photos', file); // Добавляем файлы
    });

    try {
      const response = await axios.post(`${url}/api/hotels`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      console.log('Hotel added successfully:', response.data);
      alert('Добавлено!');
      window.location.reload();
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Добавить новый отель</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Название отеля
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={hotelData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Название отеля"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            value={hotelData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Описание отеля"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Адрес
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={hotelData.address}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Адрес отеля"
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Телефон
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={hotelData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Телефон"
            required
          />
        </div>

        <div>
          <label htmlFor="twoGisURL" className="block text-sm font-medium text-gray-700">
            Ссылка на 2GIS (опционально)
          </label>
          <input
            type="text"
            id="twoGisURL"
            name="twoGisURL"
            value={hotelData.twoGisURL}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ссылка на 2GIS"
          />
        </div>

        <div>
          <label htmlFor="googleMapsURL" className="block text-sm font-medium text-gray-700">
            Ссылка на Google Maps (опционально)
          </label>
          <input
            type="text"
            id="googleMapsURL"
            name="googleMapsURL"
            value={hotelData.googleMapsURL}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ссылка на Google Maps"
          />
        </div>

        <div>
          <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
            Telegram (опционально)
          </label>
          <input
            type="text"
            id="telegram"
            name="telegram"
            value={hotelData.telegram}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ссылка на Telegram"
          />
        </div>

        <div>
          <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
            Загрузите фотографии отеля (макс. 10)
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
          className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 text-center block"
        >
          Добавить отель
        </button>
      </form>
    </div>
  );
};

export default AddHotelForm;
