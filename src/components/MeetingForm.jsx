import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import LocationPicker from "./LocationPicker";

const MeetingForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("online");
  const [locationOrLink, setLocationOrLink] = useState("");
  const [category, setCategory] = useState("important");
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [participants, setParticipants] = useState("");
  const [tags, setTags] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (type === "offline" && !selectedCoords) {
    alert("Пожалуйста, выберите место встречи на карте");
    return;
  }

  const newMeeting = {
    title,
    description,
    date,
    type,
    LocationOrLink: type === "offline"
    ? { lat: selectedCoords.lat, lng: selectedCoords.lng }
    : locationOrLink,
    participants: participants.split(",").map((s) => s.trim()),
    tags: tags.split(",").map((s) => s.trim()),
    category,
    fileUrl,
    createdAt: serverTimestamp(),
    userId: auth.currentUser?.uid,
  };

  try {
    await addDoc(collection(db, "meetings"), newMeeting);
    navigate("/");
  } catch (error) {
    console.error("Ошибка при добавлении встречи:", error);
    alert("Не удалось сохранить встречу");
  }
};


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("expires", "1d");

    try {
      const res = await fetch("https://uploadthing.com/api/files", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data?.url) setFileUrl(data.url);
      else throw new Error("Файл не загружен");
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки файла");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Новая встреча</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Название</label>
          <input type="text" className="form-control" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Описание</label>
          <textarea className="form-control" rows="3" required value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Дата и время</label>
          <input type="datetime-local" className="form-control" required value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Тип встречи</label>
          <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="online">Онлайн</option>
            <option value="offline">Оффлайн</option>
          </select>
        </div>

        {type === "offline" && (
          <>
            <label className="form-label">Выберите место встречи на карте</label>
            <LocationPicker onSelect={setSelectedCoords} />
            {selectedCoords && (
              <div className="text-muted">Выбрано: Lat: {selectedCoords.lat}, Lng: {selectedCoords.lng}</div>
            )}
          </>
        )}

        {type === "online" && (
          <div className="mb-3">
            <label className="form-label">Ссылка на встречу</label>
            <input type="text" className="form-control" value={locationOrLink} onChange={(e) => setLocationOrLink(e.target.value)} />
            <a
  href="https://meet.google.com/new"
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-outline-secondary mb-3"
>
  🔗 Открыть Google Meet
</a>

          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Файл для встречи (необязательно)</label>
          <input type="file" className="form-control" onChange={handleFileUpload} />
          {fileUrl && <div className="mt-2 text-success">Файл загружен: <a href={fileUrl} target="_blank" rel="noopener noreferrer">Открыть</a></div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Участники (email или номер, через запятую)</label>
          <input type="text" className="form-control" value={participants} onChange={(e) => setParticipants(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Теги (через запятую)</label>
          <input type="text" className="form-control" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="form-label">Категория встречи</label>
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="important">Важно</option>
            <option value="personal">Личное</option>
            <option value="work">Рабочее</option>
            <option value="other">Другое</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Сохранить встречу
        </button>
      </form>
    </div>
  );
};

export default MeetingForm;
