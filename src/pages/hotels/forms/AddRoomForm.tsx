import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface RoomData {
  number: string;
  description: string;
  roomsNumber: string;
  photos: File[];
}

const AddRoomForm: React.FC = () => {
  const { t } = useTranslation();
  const [roomData, setRoomData] = useState<RoomData>({
    number: "",
    description: "",
    roomsNumber: "",
    photos: [],
  });

  const { id: hotelId } = useParams<Record<string, string | undefined>>();
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
      alert(t("addRoom.maxPhotosAlert"));
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
      alert(t("addRoom.success"));
      // window.location.reload();
    } catch (error) {
      console.error("Error adding room:", error);
      alert(t("addRoom.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>{t("addRoom.title")}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="number">{t("addRoom.roomNumber")}</label>
          <input
            type="text"
            id="number"
            name="number"
            value={roomData.number}
            onChange={handleInputChange}
            placeholder={t("addRoom.roomNumberPlaceholder")}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="description">{t("addRoom.description")}</label>
          <textarea
            id="description"
            name="description"
            value={roomData.description}
            onChange={handleInputChange}
            placeholder={t("addRoom.descriptionPlaceholder")}
            required
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="rooms">{t("addRoom.roomsCount")}</label>
          <input
            type="number"
            id="rooms"
            name="rooms"
            value={roomData.roomsNumber}
            onChange={handleNumberChange}
            placeholder={t("addRoom.roomsCountPlaceholder")}
            min={0}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="photos">{t("addRoom.uploadPhotos")}</label>
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={inputStyle}
          />

          {roomData.photos.length > 0 && (
            <div style={{
              marginTop: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "12px"
            }}>
              {roomData.photos.map((file, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: isLoading ? "#9e9e9e" : isHovered ? "#45a049" : "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {isLoading ? t("common.loading") : t("addRoom.submit")}
        </button>
      </form>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  marginTop: "8px",
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "16px",
  outline: "none",
  transition: "border-color 0.2s",
};

export default AddRoomForm;
