import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const categoryTranslation = {
  personal: "Личное",
  work: "Работа",
  important: "Важно",
  other: "Другое",
};

const categoryColors = {
  personal: "#0d6efd",
  work: "#dc3545",
  important: "#ffc107",
  other: "#198754",
};

const ProfilePage = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const q = query(collection(db, "meetings"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMeetings(fetched);
    });
    return () => unsub();
  }, [navigate, user]);

  const upcoming = meetings
    .filter((m) => new Date(m.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const categoryStats = meetings.reduce((acc, m) => {
    const key = m.category || "other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryStats).map((key) => categoryTranslation[key] || key),
    datasets: [
      {
        label: "Количество встреч",
        data: Object.values(categoryStats),
        backgroundColor: Object.keys(categoryStats).map((key) => categoryColors[key] || "#6c757d"),
        borderRadius: 6,
      },
    ],
  };

  if (!user) return null;

  return (
    <div className="container py-4">
      <h2 className="mb-4">👤 Профиль пользователя</h2>
      <div className="card shadow-sm p-4 mb-4">
        <div className="mb-3">
          <strong>Имя пользователя:</strong>
          <div>{user.displayName || "Не указано"}</div>
        </div>
        <div className="mb-3">
          <strong>Email:</strong>
          <div>{user.email}</div>
        </div>
        <div className="mb-3">
          <strong>UID:</strong>
          <div className="text-muted" style={{ fontSize: "0.9em" }}>{user.uid}</div>
        </div>
        {user.photoURL && (
          <div className="mb-3">
            <strong>Фото профиля:</strong>
            <div><img src={user.photoURL} alt="avatar" className="img-thumbnail" style={{ maxWidth: "120px" }} /></div>
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-md-5">
          <h4 className="mt-4">📅 Ближайшие встречи</h4>
          {upcoming.length === 0 ? (
            <div className="text-muted">Нет запланированных встреч</div>
          ) : (
            <ul className="list-group mb-4">
              {upcoming.map((m) => (
                <li key={m.id} className="list-group-item d-flex justify-content-between align-items-start flex-column">
                  <div>
                    <strong>{m.title}</strong>
                    <div className="text-muted">{new Date(m.date).toLocaleString()}</div>
                    {m.type === "online" && m.LocationOrLink && (
                      <div>
                        <a href={m.LocationOrLink} target="_blank" rel="noopener noreferrer">
                          Перейти к встрече
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="badge bg-primary align-self-end mt-2">
                    {categoryTranslation[m.category] || "Категория"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-md-7">
          <h4 className="mt-4">📊 Статистика по категориям</h4>
          <div className="row mb-4">
            <Bar data={chartData} />
          </div>
        </div>
      </div>

      <h4 className="mt-4">📈 Общая активность</h4>
      <ul className="list-group">
        <li className="list-group-item">Всего встреч: {meetings.length}</li>
        <li className="list-group-item">Онлайн: {meetings.filter(m => m.type === "online").length}</li>
        <li className="list-group-item">Оффлайн: {meetings.filter(m => m.type === "offline").length}</li>
      </ul>
    </div>
  );
};

export default ProfilePage;
