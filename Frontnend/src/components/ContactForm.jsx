import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faCommentDots, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestNumber: '',
    subject: '',
    message: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    fetch('http://localhost:8080/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        setSuccessMessage('Message sent successfully!');
        setFormData({
          guestName: '',
          guestEmail: '',
          guestNumber: '',
          subject: '',
          message: ''
        });
      } else {
        response.text().then((text) => {
          setErrorMessage('Error sending message! Server says: ' + text);
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setErrorMessage('Network error! Please try again later.');
    });
  };

  return (
    <section
      className="d-flex justify-content-center align-items-center p-3"
      style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          backgroundColor: 'whitesmoke',
          borderRadius: '15px 15px 0 0',
          padding: '2rem',
          marginTop: '1rem',
        }}
      >
        <h3 className="text-center mb-4">Send Us a Message</h3>

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Full Name */}
            <div className="col-md-6">
              <label className="form-label">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Full Name
              </label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                className="form-control"
                placeholder="full name"
                required
              />
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                Email
              </label>
              <input
                type="email"
                name="guestEmail"
                value={formData.guestEmail}
                onChange={handleChange}
                className="form-control"
                placeholder="email"
                required
              />
            </div>

            {/* WhatsApp Number */}
            <div className="col-md-6">
              <label className="form-label">
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                WhatsApp Number
              </label>
              <input
                type="text"
                name="guestNumber"
                value={formData.guestNumber}
                onChange={handleChange}
                className="form-control"
                placeholder=" WhatsApp number"
                required
              />
            </div>

            {/* Subject */}
            <div className="col-md-6">
              <label className="form-label">
                <FontAwesomeIcon icon={faCommentDots} className="me-2" />
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="booking">Booking Information</option>
                <option value="support">Support Request</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="col-12">
              <label className="form-label">
                <FontAwesomeIcon icon={faCommentDots} className="me-2" />
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-control"
                rows="5"
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>

            {/* Send Button */}
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-primary mt-3 px-4 py-2">
                <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                Send Message
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
