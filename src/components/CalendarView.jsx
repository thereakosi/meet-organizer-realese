import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarView = ({ meetings = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Функция сравнения даты без времени
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Отфильтрованные встречи на выбранную дату
  const filteredMeetings = meetings.filter((meeting) =>
    isSameDay(new Date(meeting.date), selectedDate)
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        <span role="img" aria-label="calendar">📅</span> Календарь встреч
      </h2>

      <div className="row">
        {/* Календарь слева */}
        <div className="col-md-4 mb-4">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="w-100"
          />
        </div>

        {/* Список встреч справа */}
        <div className="col-md-8">
          <h5 className="mb-3">
            Встречи на {selectedDate.toLocaleDateString("ru-RU")}:
          </h5>

          {filteredMeetings.length === 0 ? (
            <p className="text-muted">Нет встреч на эту дату.</p>
          ) : (
            <ul className="list-group">
              {filteredMeetings
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((meeting, index) => (
                  <li key={index} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>{meeting.title}</strong>
                      <span className="text-muted">
                        🕒 {new Date(meeting.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="mb-1">{meeting.description}</p>

                    <div className="mb-1">
                      <span className={`badge me-2 ${meeting.category === "important" ? "bg-danger" :
                        meeting.category === "personal" ? "bg-warning text-dark" : "bg-success"}`}>
                        {meeting.category === "important" && "Важно"}
                        {meeting.category === "personal" && "Личное"}
                        {meeting.category === "work" && "Рабочее"}
                      </span>

                      <span className="badge bg-info text-dark">
                        {meeting.type === "online" ? "Онлайн" : "Оффлайн"}
                      </span>
                    </div>

                    {meeting.type === "online" && meeting.LocationOrLink && (
                      <p className="mb-0">
                        <strong>Ссылка: </strong>
                        <a href={meeting.LocationOrLink} target="_blank" rel="noopener noreferrer">
                          Перейти
                        </a>
                      </p>
                    )}

                    {meeting.type === "offline" &&
  typeof meeting.LocationOrLink === "object" &&
  "lat" in meeting.LocationOrLink &&
  "lng" in meeting.LocationOrLink && (
    <p>
      <strong>Адрес: </strong>
      <a
        href={`https://2gis.kz/almaty/geo/${meeting.LocationOrLink.lng},${meeting.LocationOrLink.lat}`}

        target="_blank"
        rel="noopener noreferrer"
      >
        Открыть в 2GIS
      </a>
    </p>
)}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
