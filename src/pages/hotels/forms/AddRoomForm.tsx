import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface RoomData {
  number: string;
  description: string;
  roomsNumber: string;
  photos: File[];
}

const AddRoomForm: React.FC = () => {
  const [roomData, setRoomData] = useState<RoomData>({
    number: "",
    description: "",
    roomsNumber: "",
    photos: [],
  });

  const { id: hotelId } = useParams<Record<string, string | undefined>>(); // Исправлено

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const url = import.meta.env.VITE_URL;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      roomsNumber: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + roomData.photos.length > 10) {
      alert("Вы можете загрузить не более 10 фотографий.");
      return;
    }
    setRoomData((prevData) => ({
      ...prevData,
      photos: [...prevData.photos, ...files],
    }));
  };

  const handleRemoveFile = (index: number) => {
    setRoomData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!hotelId) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("number", roomData.number);
      formData.append("description", roomData.description);
      formData.append("roomsNumber", roomData.roomsNumber);

      roomData.photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${url}/api/rooms/${hotelId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Room added successfully:", response.data);
      alert("Успех!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding room:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>Добавить номер</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="number" style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#333" }}>
            Номер
          </label>
          <input
            type="text"
            id="number"
            name="number"
            value={roomData.number}
            onChange={handleInputChange}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            placeholder="Номер"
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="description" style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#333" }}>
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            value={roomData.description}
            onChange={handleInputChange}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s",
              resize: "vertical",
            }}
            placeholder="Описание номера"
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="rooms" style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#333" }}>
            Количество комнат
          </label>
          <input
            type="number"
            id="rooms"
            name="rooms"
            value={roomData.roomsNumber}
            onChange={handleNumberChange}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            placeholder="Количество комнат"
            min={0}
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="photos" style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#333" }}>
            Загрузите фотографии отеля (макс. 10)
          </label>
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          />

          {roomData.photos.length > 0 && (
            <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "12px" }}>
              {roomData.photos.map((file, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      backgroundColor: "#f44336",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          onMouseEnter={() => setIsHovered(true)}  // Добавляем событие на ховер
          onMouseLeave={() => setIsHovered(false)} // Убираем эффект ховера
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: isLoading ? "#9e9e9e" : isHovered ? "#45a049" : "#4caf50", // Меняем цвет фона при ховере
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {isLoading ? "Загрузка..." : "Добавить номер"}
        </button>
      </form>
    </div>
  );
};

export default AddRoomForm;
