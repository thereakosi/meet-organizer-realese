// MeetingEditModal.js
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const MeetingEditModal = ({ show, handleClose, meeting, onSave }) => {
  const [title, setTitle] = useState(meeting.title);
  const [description, setDescription] = useState(meeting.description);
  const [date, setDate] = useState(meeting.date);
  const [type, setType] = useState(meeting.type);
  const [category, setCategory] = useState(meeting.category);
  const [link, setLink] = useState(meeting.link);
  const [location, setLocation] = useState(meeting.location);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...meeting,
      title,
      description,
      date,
      type,
      category,
      link,
      location,
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Редактировать встречу</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
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

          <Form.Group className="mb-3">
            <Form.Label>Тип встречи</Form.Label>
            <Form.Select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="online">Онлайн</option>
              <option value="offline">Оффлайн</option>
            </Form.Select>
          </Form.Group>

          {type === "online" ? (
            <Form.Group className="mb-3">
              <Form.Label>Ссылка</Form.Label>
              <Form.Control
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Адрес</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Категория</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="important">Важно</option>
              <option value="personal">Личное</option>
              <option value="work">Рабочее</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Сохранить изменения
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MeetingEditModal;
