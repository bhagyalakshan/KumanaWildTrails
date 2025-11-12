import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faUsers,
  faChild,
  faUser,
  faEnvelope,
  faPhone,
  faLocationDot,
  faCalendarDays,
  faCommentDots,
  faRoute,
} from '@fortawesome/free-solid-svg-icons';

const TukTukBookingForm = ({ packageDetails }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    numKids: '0',
    numAdults: '0',
    safariDate: '',
    safariPackageId: '0',
    totalAmount: '0.00',
    specialRequests: '',
    pickupLocation: '',
    fromLocation: '',
    toLocation: '',
  });

  const [bookingMessage, setBookingMessage] = useState('');
  const [messageType, setMessageType] = useState('');
const [loading, setLoading] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if ((name === 'numKids' || name === 'numAdults') && value !== '') {
      if (!/^\d*$/.test(value)) return;
    }

    if (name === 'vehicleCheckbox') {
      setFormData((prev) => ({
        ...prev,
        safariPackageId: checked ? '1' : '0',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneKeyPress = (e) => {
    const charCode = e.charCode || e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (parseInt(formData.numAdults, 10) < 1) {
    alert('Please specify at least one adult.');
    return;
  }

  setLoading(true); // start loading

  const payload = {
    guestName: formData.guestName,
    guestEmail: formData.guestEmail,
    guestPhone: formData.guestPhone,
    safariPackageName: packageDetails.packageName,
    safariPackageId: parseInt(formData.safariPackageId, 10),
    numKids: parseInt(formData.numKids, 10) || 0,
    numAdults: parseInt(formData.numAdults, 10) || 0,
    safariDate: formData.safariDate,
    totalAmount: parseFloat(formData.totalAmount) || 0.0,
    paymentStatus: 'Pending',
    pickupLocation: formData.pickupLocation,
    specialRequests: formData.specialRequests,
    bookingDate: new Date().toISOString(),
  };

  try {
    const response = await fetch('http://localhost:8080/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    setBookingMessage('✅ All Done! Our Team will contact you soon!');
    setMessageType('success');

    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      numKids: '0',
      numAdults: '0',
      safariDate: '',
      safariPackageId: '',
      totalAmount: '0.00',
      specialRequests: '',
      pickupLocation: '',
    });
  } catch (error) {
    console.error('Booking failed:', error);
    setBookingMessage('❌ Booking Failed. Please try again.');
    setMessageType('error');
  } finally {
    setLoading(false); // stop loading
  }
};


  const renderInputGroup = (icon, name, type, placeholder, value, required = false, onKeyPress = null, min = null) => (
    <div className="input-group">
      <span className="input-group-text bg-light">
        <FontAwesomeIcon icon={icon} />
      </span>
      <input
        type={type}
        className="form-control"
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        onKeyPress={onKeyPress}
        min={min}
        style={{ backgroundColor: '#f8f9fa' }}
      />
    </div>
  );

  return (
    <div className="w-100" style={{ maxWidth: '500px' }}>
      <div className="text-center mb-4">
        <img
          src="/assets/TukLogo.png"
          alt="Tuk Tuk Logo"
          style={{ maxWidth: '120px', height: 'auto' }}
        />
      </div>

      <div
        className="text-center mb-3 p-3 rounded-3"
        style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold', fontSize: '1.1rem', border: '3px solid #FFA500' }}
      >
        <div className="row">
          <div className="col-6">
            {renderInputGroup(faRoute, 'fromLocation', 'text', 'From', formData.fromLocation, true)}
          </div>
          <div className="col-6">
            {renderInputGroup(faRoute, 'toLocation', 'text', 'To', formData.toLocation, true)}
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-center">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="vehicleCheckbox"
              name="vehicleCheckbox"
              style={{ border: '1px solid orange' }}
              checked={formData.safariPackageId === '1'}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="vehicleCheckbox" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
              I want a round trip
            </label>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center gap-5 p-3 mb-4" style={{ backgroundColor: '#f8fdfd', borderRadius: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
        <div className="text-center">
          <div className="rounded-circle d-flex justify-content-center align-items-center mb-1" style={{ width: '40px', height: '40px', backgroundColor: '#d3f1f1' }}>
            <FontAwesomeIcon icon={faUsers} className="text-dark" />
          </div>
          <div style={{ fontSize: '0.95rem', color: '#004b4b' }}><strong>Adults:</strong> (Age: 12–99)</div>
        </div>

        <div className="text-center">
          <div className="rounded-circle d-flex justify-content-center align-items-center mb-1" style={{ width: '40px', height: '40px', backgroundColor: '#d3f1f1' }}>
            <FontAwesomeIcon icon={faChild} className="text-dark" />
          </div>
          <div style={{ fontSize: '0.95rem', color: '#004b4b' }}><strong>Kids:</strong> (Age: 11 and Younger)</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
        <div className="row g-2 flex-grow-1">
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            {renderInputGroup(faUser, 'guestName', 'text', 'Full Name', formData.guestName, true)}
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            {renderInputGroup(faEnvelope, 'guestEmail', 'email', 'Email', formData.guestEmail, true)}
          </div>

          <div className="col-md-4">
            <label className="form-label">Phone</label>
            {renderInputGroup(faPhone, 'guestPhone', 'tel', 'Phone', formData.guestPhone, true, handlePhoneKeyPress)}
          </div>

          <div className="col-md-4">
            <label className="form-label">Kids</label>
            {renderInputGroup(faChild, 'numKids', 'number', '0', formData.numKids, false, null, 0)}
          </div>

          <div className="col-md-4">
            <label className="form-label">Adults</label>
            {renderInputGroup(faUsers, 'numAdults', 'number', '1', formData.numAdults, true, null, 1)}
          </div>

          <div className="col-md-6">
            <label className="form-label">Tour Date</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FontAwesomeIcon icon={faCalendarDays} />
              </span>
              <input
                type="date"
                className="form-control"
                name="safariDate"
                value={formData.safariDate}
                onChange={handleChange}
                placeholder=""
                required
                min={getTodayDate()}
                style={{ backgroundColor: '#f8f9fa' }}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Pickup Location</label>
            {renderInputGroup(faLocationDot, 'pickupLocation', 'text', 'Pickup Location', formData.pickupLocation, true)}
          </div>

          <div className="col-12 mb-2">
            <label className="form-label">Special Requests</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FontAwesomeIcon icon={faCommentDots} />
              </span>
              <textarea
                name="specialRequests"
                className="form-control"
                rows="4"
                value={formData.specialRequests}
                onChange={handleChange}
                style={{ backgroundColor: '#f8f9fa' }}
              ></textarea>
            </div>
          </div>

          <div className="col-12 p-3 text-center rounded-3" style={{ backgroundColor: '#f8f9fa', color: '#006400', fontWeight: 'bold', border: '3px solid #FFA500' }}>
            The Customised price we will let you know soon
          </div>

          {/* Submit */}
<div className="col-12 mb-2">
  <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
    <i className="bi bi-calendar-check-fill me-2"></i>
    {loading ? 'Booking...' : 'Book Now'}
  </button>
</div>

{/* Response Message */}
<div className="col-12">
  {loading && (
    <div className="alert alert-warning d-flex align-items-center justify-content-center animate__animated animate__fadeIn" role="alert">
      <i className="bi bi-hourglass-split me-2"></i>
      Please wait, processing your booking...
    </div>
  )}

  {!loading && bookingMessage && (
    <div
      className={`alert d-flex align-items-center justify-content-center animate__animated animate__fadeIn ${
        messageType === 'success' ? 'alert-success' : 'alert-danger'
      }`}
      role="alert"
    >
      {messageType === 'success' ? (
        <i className="bi bi-check-circle-fill me-2"></i>
      ) : (
        <i className="bi bi-x-circle-fill me-2"></i>
      )}
      {bookingMessage}
    </div>
  )}
</div>
        </div>
      </form>
    </div>
  );
};

export default TukTukBookingForm;
