import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user"); // если используешь localStorage
      navigate('/login');
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      alert("Ошибка выхода");
    }
  };

  return (
    <div className="text-end mb-3">
      <button className="btn btn-outline-danger" onClick={handleLogout}>
        Выйти
      </button>
    </div>
  );
};

export default LogoutButton;
