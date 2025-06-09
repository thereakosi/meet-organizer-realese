import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const EditModal = ({ show, meeting, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title);
      setDescription(meeting.description);
      setDate(meeting.date);
    }
  }, [meeting]);

  const handleSave = async () => {
    if (!meeting) return;
    try {
      await updateDoc(doc(db, "meetings", meeting.id), {
        title,
        description,
        date,
      });
      onClose();
    } catch (err) {
      alert("Ошибка при сохранении изменений");
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Редактировать встречу</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Дата и время</Form.Label>
            <Form.Control
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
