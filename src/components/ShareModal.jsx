import React from "react";
import { Modal, Button } from "react-bootstrap";

const ShareModal = ({ show, onClose, meeting }) => {
  if (!meeting) return null;

  const shareText = `📅 Встреча: ${meeting.title}
📝 Описание: ${meeting.description}
📍 ${meeting.type === "online"
  ? `Ссылка: ${meeting.LocationOrLink}`
  : `Адрес: https://2gis.kz/almaty/geo/${meeting.LocationOrLink.lng},${meeting.LocationOrLink.lat}`}
📆 Дата: ${new Date(meeting.date).toLocaleDateString()}
🕒 Время: ${new Date(meeting.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;


  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Поделиться встречей</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre>{shareText}</pre>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleCopy}>
          📋 Скопировать
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;
