import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = () => {
    setIsLoading(true);
    fetch("http://localhost:8080/api/messages")
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedId(null);
    setShowModal(false);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:8080/api/messages/${selectedId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchMessages();
          closeModal();
        } else {
          alert("Failed to delete the message.");
        }
      })
      .catch((error) => console.error("Error deleting message:", error));
  };

  const filteredMessages = messages.filter((msg) =>
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // assign colors based on subject text
  const getSubjectClass = (subject) => {
    if (!subject) return "text-light";
    const s = subject.toLowerCase();
    if (s.includes("booking")) return "text-primary fw-bold";
    if (s.includes("inquiry")) return "text-success fw-bold";
    if (s.includes("complaint")) return "text-danger fw-bold";
    return "text-warning fw-bold";
  };

  return (
    <div
      className="min-vh-100 py-5 px-4"
      style={{
        backgroundImage: 'url("/admin.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style>
        {`
          .glass-card {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
          }
          .search-input {
            background-color: white !important;
            color: black !important;
            border-radius: 8px;
            padding: 10px 15px;
            border: 1px solid #ddd;
          }
          .search-input::placeholder {
            color: black !important;
            opacity: 0.7;
          }
          .modern-table thead {
            background: #2d3748;
            color: #fff;
          }
          .modern-table tbody tr {
            transition: background 0.2s;
          }
          .modern-table tbody tr:hover {
            background: rgba(255,255,255,0.05);
          }
        `}
      </style>

      <div className="container glass-card">
        <h2 className="mb-4 text-center text-info">📩 Contact Messages</h2>

        {/* Search Field */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by subject..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-dark table-bordered table-hover modern-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Email</th>
                <th>Phone (WhatsApp)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center text-light">
                    Loading...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-light">
                    No messages in the database.
                  </td>
                </tr>
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td>{msg.guestName}</td>
                    <td className={getSubjectClass(msg.subject)}>{msg.subject}</td>
                    <td>{msg.message}</td>
                    <td>
                      <a
                        href={`mailto:${msg.guestEmail}`}
                        className="text-info text-decoration-none"
                      >
                        {msg.guestEmail}
                      </a>
                    </td>
                    <td>
                      <a
                        href={`https://wa.me/${msg.guestNumber.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-success text-decoration-none"
                      >
                        {msg.guestNumber}
                      </a>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => openModal(msg.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-light">
                    No messages match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">⚠ Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this message? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactMessages;
