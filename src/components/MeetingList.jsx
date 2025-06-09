import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ShareModal from "./ShareModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";




const MeetingList = ({ meetings, setMeetings, deleteMeeting }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [shareModalShow, setShareModalShow] = useState(false);
  const [shareMeeting, setShareMeeting] = useState(null);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);

  const handleEdit = (meeting) => {
    setSelectedMeeting(meeting);
    setShowModal(true);
  };

  const handleSave = (updatedMeeting) => {
    const updatedMeetings = meetings.map((m) =>
      m.id === updatedMeeting.id ? updatedMeeting : m
    );
    setMeetings(updatedMeetings);
    setShowModal(false);
  };

  const filteredMeetings = meetings.filter((meeting) => {
    let isMatch = true;
    if (filter === "recent") {
      const now = new Date();
      const createdAt = new Date(meeting.date);
      const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      if (diffDays > 7) isMatch = false;
    }
    if (!meeting.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      isMatch = false;
    }
    return isMatch;
  });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📋 Список встреч</h2>
        <div>
          <Link to="/new" className="btn btn-success me-2">+ Новая встреча</Link>
          <Link to="/calendar" className="btn btn-outline-primary">📅 Календарь</Link>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Все</option>
            <option value="recent">Последние 7 дней</option>
          </select>
        </div>
        <div className="col-md-8 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredMeetings.length === 0 ? (
        <p className="text-muted">Нет доступных встреч.</p>
      ) : (
        <div className="row">
          {filteredMeetings.map((meeting, index) => (
            <motion.div
              className="col-md-6 mb-4"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{meeting.title}</h5>
                  <p className="card-text">{meeting.description}</p>

                  <p className="mb-2">
                    📅 <strong>{new Date(meeting.date).toLocaleDateString()}</strong> 🕒 <strong>{new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                  </p>

                  <div className="mb-2">
                    <span className={`badge me-2 ${meeting.category === "important" ? "bg-danger" : meeting.category === "personal" ? "bg-warning text-dark" : "bg-success"}`}>
                      {meeting.category === "important" && "Важно"}
                      {meeting.category === "personal" && "Личное"}
                      {meeting.category === "work" && "Рабочее"}
                    </span>
                    <span className="badge bg-info text-dark">
                      {meeting.type === "online" ? "Онлайн" : "Оффлайн"}
                    </span>
                  </div>

                  {meeting.type === "online" && meeting.LocationOrLink && (
                    <p><strong>Ссылка: </strong><a href={meeting.LocationOrLink} target="_blank" rel="noopener noreferrer">Перейти к встрече</a></p>
                  )}
                  {meeting.type === "offline" && meeting.LocationOrLink && (
                    <p><strong>Адрес: </strong>{meeting.LocationOrLink}</p>
                  )}

                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                    <div>
                    <button
  className="btn btn-outline-primary btn-sm me-2"
  disabled
>
  ✏️ Редактировать
</button>

                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => {
                            setShareMeeting(meeting);
                            setShareModalShow(true);
                        }}
                      >
                        📤 Поделиться
                      </button>
                    </div>

                    <button
  className="btn btn-outline-danger btn-sm"
  onClick={() => {
    setMeetingToDelete(meeting);
    setDeleteModalShow(true);
  }}
>
  🗑️
</button>



                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

<ShareModal
  show={shareModalShow}
  meeting={shareMeeting}
  onClose={() => setShareModalShow(false)}
/>

<ConfirmDeleteModal
  show={deleteModalShow}
  meeting={meetingToDelete}
  onClose={() => setDeleteModalShow(false)}
  onConfirm={() => {
    deleteMeeting(meetings.indexOf(meetingToDelete));
    setDeleteModalShow(false);
  }}
/>

     
    </div>
  );
};

export default MeetingList;
