import React, { useState, useEffect } from "react";
import "../styles/home.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ShareModal from "./ShareModal";
import EditModal from "./EditModal.jsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import {
  FaUser,
  FaBriefcase,
  FaExclamation,
  FaMapMarkerAlt,
  FaLink,
  FaTrash,
  FaEdit,
  FaShareSquare,
  FaTags,
  FaPlus,
  FaRegStickyNote,
} from "react-icons/fa";

const Home = ({ meetings, setMeetings }) => {
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [shareModalShow, setShareModalShow] = useState(false);
  const [shareMeeting, setShareMeeting] = useState(null);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const [editModalShow, setEditModalShow] = useState(false);
  const [meetingToEdit, setMeetingToEdit] = useState(null);

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;
      const q = query(collection(db, "meetings"), where("userId", "==", user.uid));
      const unsub = onSnapshot(q, (snapshot) => {
        const fetchedMeetings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMeetings(fetchedMeetings);
      });

      const notesQuery = query(collection(db, "notes"), where("userId", "==", user.uid));
      const notesUnsub = onSnapshot(notesQuery, (snapshot) => {
        const fetchedNotes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotes(fetchedNotes);
      });

      return () => {
        unsub();
        notesUnsub();
      };
    });
    return () => unsubscribeAuth();
  }, [setMeetings]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "meetings", id));
    setDeleteModalShow(false);
  };

  const addNote = async () => {
    if (newNote.trim()) {
      await addDoc(collection(db, "notes"), {
        userId: auth.currentUser.uid,
        content: newNote,
        createdAt: new Date().toISOString(),
      });
      setNewNote("");
    }
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const updateNote = async (id, newContent) => {
    await updateDoc(doc(db, "notes", id), { content: newContent });
  };

  const getCategoryCardClass = (category) => {
    switch (category) {
      case "important": return "card card-important custom-card rounded shadow-sm";
      case "personal": return "card card-personal custom-card rounded shadow-sm";
      case "work": return "card card-work custom-card rounded shadow-sm";
      case "other": return "card card-other custom-card rounded shadow-sm";
      default: return "card card-default custom-card rounded shadow-sm";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "important": return <FaExclamation className="text-danger" />;
      case "personal": return <FaUser className="text-primary" />;
      case "work": return <FaBriefcase className="text-success" />;
      case "other": return <FaTags className="text-warning" />;
      default: return <FaTags className="text-secondary" />;
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    let isMatch = true;
    if (filter === "recent") {
      const now = new Date();
      const createdAt = new Date(meeting.date);
      const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      if (diffDays > 7) isMatch = false;
    }
    if (categoryFilter !== "all" && meeting.category !== categoryFilter) {
      isMatch = false;
    }
    if (selectedDate) {
      const formatted = selectedDate.toISOString().slice(0, 10);
      if (!meeting.date.startsWith(formatted)) {
        isMatch = false;
      }
    } else if (!meeting.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      isMatch = false;
    }
    return isMatch;
  });

  return (
    <div className="home-container">
      <div className="home-left rounded bg-light shadow-sm p-3">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={({ date }) => {
            const hasMeeting = meetings.some(m => m.date?.startsWith(date.toISOString().slice(0, 10)));
            return hasMeeting ? "calendar-day-events" : null;
          }}
          tileContent={({ date }) => {
            const events = meetings.filter(m => m.date?.startsWith(date.toISOString().slice(0, 10)));
            return (
              <div className="calendar-badges">
                {events.slice(0, 2).map((m, i) => (
                  <span key={i} className="calendar-badge">{getCategoryIcon(m.category)}</span>
                ))}
                {events.length > 2 && (
                  <span className="calendar-badge">+{events.length - 2}</span>
                )}
              </div>
            );
          }}
          formatShortWeekday={(locale, date) => ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][date.getDay()]}
        />
        <div className="meeting-stats mt-4">
          <h6 className="fw-semibold mb-2">Статистика</h6>
          <ul className="list-group small">
            <li className="list-group-item">Всего встреч: {meetings.length}</li>
            <li className="list-group-item">Сегодня: {meetings.filter(m => m.date?.startsWith(new Date().toISOString().slice(0, 10))).length}</li>
            <li className="list-group-item">Важно: {meetings.filter(m => m.category === "important").length}</li>
          </ul>
        </div>

        <div className="notes mt-4">
          <h6 className="fw-semibold mb-2"><FaRegStickyNote /> Заметки</h6>
          <div className="input-group mb-2">
            <input type="text" className="form-control" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Новая заметка..." />
            <button className="btn btn-primary" onClick={addNote}><FaPlus /></button>
          </div>
          <ul className="list-group small">
            {notes.map(note => (
              <li key={note.id} className="list-group-item d-flex justify-content-between align-items-center">
                <textarea
                  className="form-control me-2"
                  rows={1}
                  value={note.content}
                  onChange={(e) => updateNote(note.id, e.target.value)}
                />
                <button className="btn btn-sm btn-danger" onClick={() => deleteNote(note.id)}><FaTrash /></button>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className="home-right">
        <div className="controls">
          <div className="filters">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded">
              <option value="all">Все</option>
              <option value="recent">Последние 7 дней</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded">
              <option value="all">Все категории</option>
              <option value="important">Важно</option>
              <option value="personal">Личное</option>
              <option value="work">Рабочее</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div className="search-add">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded"
            />
            <Link to="/new" className="btn-create btn btn-success rounded">+ Новая встреча</Link>
          </div>
        </div>

        <div className="card-grid">
          {filteredMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={getCategoryCardClass(meeting.category)}>
                <div className="card-body d-flex flex-column justify-content-between" style={{ height: '100%' }}>
                  <div>
                    <h5 className="mb-2">{getCategoryIcon(meeting.category)} {meeting.title}</h5>
                    <p className="mb-1">{meeting.description}</p>
                    <p className="mb-1">📅 <strong>{new Date(meeting.date).toLocaleDateString()}</strong> 🕒 <strong>{new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
                    <p className="mb-1"><span className="badge badge-info">{meeting.type === "online" ? "Онлайн" : "Оффлайн"}</span></p>
                    {meeting.participants?.length > 0 && <p className="mb-1"><strong>Участники:</strong> {meeting.participants.join(", ")}</p>}
                    {meeting.tags?.length > 0 && (
                      <div className="mb-1">
                        {meeting.tags.map((tag, i) => (
                          <span key={i} className="badge badge-secondary me-1">#{tag}</span>
                        ))}
                      </div>
                    )}
                    {meeting.type === "online" && meeting.LocationOrLink && (
                      <p className="mb-1"><strong>Ссылка: </strong><a href={meeting.LocationOrLink} target="_blank"><FaLink /></a></p>
                    )}
                    {meeting.type === "offline" && typeof meeting.LocationOrLink === "object" && "lat" in meeting.LocationOrLink && (
                      <p className="mb-1"><strong>Адрес: </strong><a href={`https://2gis.kz/almaty/geo/${meeting.LocationOrLink.lng},${meeting.LocationOrLink.lat}`} target="_blank"><FaMapMarkerAlt /></a></p>
                    )}
                    {meeting.fileUrl && (
                      <p className="mb-1"><strong>Файл: </strong><a href={meeting.fileUrl} target="_blank">Открыть</a></p>
                    )}
                  </div>
                  <div className="card-actions d-flex justify-content-between pt-2">
                    <button className="btn btn-sm btn-outline-primary rounded" onClick={() => {
                      setMeetingToEdit(meeting);
                      setEditModalShow(true);
                    }}><FaEdit /></button>
                    <button className="btn btn-sm btn-outline-success rounded" onClick={() => {
                      setShareMeeting(meeting);
                      setShareModalShow(true);
                    }}><FaShareSquare /></button>
                    <button className="btn btn-sm btn-outline-danger rounded" onClick={() => {
                      setMeetingToDelete(meeting);
                      setDeleteModalShow(true);
                    }}><FaTrash /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ShareModal show={shareModalShow} meeting={shareMeeting} onClose={() => setShareModalShow(false)} />
      <EditModal show={editModalShow} meeting={meetingToEdit} onClose={() => setEditModalShow(false)} />
      <ConfirmDeleteModal show={deleteModalShow} meeting={meetingToDelete} onClose={() => setDeleteModalShow(false)} onConfirm={() => handleDelete(meetingToDelete.id)
} />
    </div>
  );
};

export default Home;
