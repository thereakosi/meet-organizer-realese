import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MeetingForm from "./components/MeetingForm";
import CalendarView from "./components/CalendarView";
import LoginWithGoogle from "./components/LoginWithGoogle";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/home";
import Navbar from "./components/navbar";
import ProfilePage from "./components/Profile";

const App = () => {
  const [meetings, setMeetings] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();
  const location = useLocation();

  const addMeeting = (meeting) => {
    const newMeeting = {
      ...meeting,
      createdAt: new Date().toISOString(),
    };
    setMeetings([...meetings, newMeeting]);
    navigate("/");
  };

  const deleteMeeting = (indexToDelete) => {
    const updatedMeetings = meetings.filter((_, index) => index !== indexToDelete);
    setMeetings(updatedMeetings);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const checkMeetings = () => {
      const now = new Date();
      const nowPlus5 = new Date(now.getTime() + 5 * 60 * 1000);

      meetings.forEach((meeting) => {
        if (!meeting.date || !meeting.time) return;
        const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
        if (meetingDateTime > now && meetingDateTime <= nowPlus5) {
          alert(`Напоминание: скоро встреча "${meeting.title}"!`);
        }
      });
    };

    const interval = setInterval(checkMeetings, 30000);
    return () => clearInterval(interval);
  }, [meetings]);

  // ⛔️ Убираем Navbar только на /login
  const hideNavbar = location.pathname === "/login";

  return (
    <div className={`min-vh-100 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <div className="container py-4">
        {!hideNavbar && <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />}

        <Routes>
          <Route path="/login" element={<LoginWithGoogle setUser={setUser} />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home meetings={meetings} setMeetings={setMeetings} deleteMeeting={deleteMeeting} />
              </PrivateRoute>
            }
          />
          <Route path="/new" element={<MeetingForm addMeeting={addMeeting} />} />
          <Route path="/calendar" element={<CalendarView meetings={meetings} />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
