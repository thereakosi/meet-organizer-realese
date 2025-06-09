import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "../styles/login.css";

const LoginWithGoogle = ({ setUser }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      }));

      setUser({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      window.location.href = "/";
    } catch (error) {
      console.error("Ошибка входа:", error);
      alert("Ошибка авторизации через Google");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow">
        <h2 className="mb-3">👋 Добро пожаловать в Meet Organizer</h2>
        <p className="text-muted mb-4">
          Ваш персональный инструмент для организации встреч, событий и задач. Войдите через Google, чтобы начать планировать и не упустить ни одной важной детали.
        </p>
        <ul className="text-start mb-4">
          <li>📅 Создавайте и управляйте встречами</li>
          <li>📍 Указывайте точное место на карте</li>
          <li>🔗 Делитесь ссылками с участниками</li>
          <li>📂 Прикрепляйте важные файлы</li>
          <li>📊 Просматривайте встречи в календаре</li>
        </ul>
        <button className="btn btn-primary btn-lg w-100" onClick={handleLogin}>
          🔐 Войти через Google
        </button>
      </div>
    </div>
  );
};

export default LoginWithGoogle;
