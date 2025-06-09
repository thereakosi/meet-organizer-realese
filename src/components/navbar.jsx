import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FaHome, FaCalendarAlt, FaUser, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import "../styles/navbar.css";

const Navbar = ({ darkMode, toggleTheme }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">📅</span>
        <h4 className="navbar-title">Meet Organizer</h4>
      </div>

      <div className="navbar-links">
        <Link to="/" className="navbar-button">
          <FaHome /> <span>Главная</span>
        </Link>
        <Link to="/calendar" className="navbar-button">
          <FaCalendarAlt /> <span>Календарь</span>
        </Link>
        <Link to="/profile" className="navbar-button">
          <FaUser /> <span>Профиль</span>
        </Link>
        <button onClick={toggleTheme} className="navbar-button">
          {darkMode ? <><FaSun /> <span>Светлая</span></> : <><FaMoon /> <span>Тёмная</span></>}
        </button>
        <button onClick={handleLogout} className="navbar-button logout">
          <FaSignOutAlt /> <span>Выйти</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
