import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMotorcycle,
  faTaxi,
  faCar,
  faShuttleVan,
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

const CustomBookingForm = ({ packageDetails }) => {
  const [formData, setFormData] = useState({
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
    fromLocation: '',
    toLocation: '',
  });

  const [bookingMessage, setBookingMessage] = useState('');
  const [messageType, setMessageType] = useState('');
const [loading, setLoading] = useState(false);

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'numKids' || name === 'numAdults') && value !== '') {
      if (!/^\d*$/.test(value)) return;
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

  if (!formData.safariPackageId) {
    alert('Please select a vehicle type.');
    return;
  }

  if (!formData.fromLocation || !formData.toLocation) {
    alert('Please enter both From and To locations.');
    return;
  }

  const safariPackageName = `${formData.fromLocation.trim()} To ${formData.toLocation.trim()}`;

  const payload = {
    guestName: formData.guestName,
    guestEmail: formData.guestEmail,
    guestPhone: formData.guestPhone,
    safariPackageName: safariPackageName,
    safariPackageId: parseInt(formData.safariPackageId, 10),
    numKids: parseInt(formData.numKids, 10) || 0,
    numAdults: parseInt(formData.numAdults, 10) || 0,
    safariDate: formData.safariDate,
    totalAmount: 0.0,
    paymentStatus: 'Pending',
    pickupLocation: formData.pickupLocation,
    specialRequests: formData.specialRequests,
    bookingDate: new Date().toISOString(),
  };

  setLoading(true); // Start loading

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
      fromLocation: '',
      toLocation: '',
    });
  } catch (error) {
    console.error('Booking failed:', error);
    setBookingMessage('❌ Booking Failed. Please try again.');
    setMessageType('error');
  } finally {
    setLoading(false); // Stop loading
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
      <div className="text-center mb-3 p-3 rounded-3" style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold', fontSize: '1.1rem', border: '3px solid #FFA500' }}>
        <div className="row">
          <div className="col-6">
            {renderInputGroup(faRoute, 'fromLocation', 'text', 'From', formData.fromLocation, true)}
          </div>
          <div className="col-6">
            {renderInputGroup(faRoute, 'toLocation', 'text', 'To', formData.toLocation, true)}
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
          <div className="col-12 mb-3">
            <label className="form-label d-block">Select Vehicle Type</label>
            <div className="d-flex gap-2 flex-wrap justify-content-between">
              {[
                { id: '1', label: 'Bike', icon: faMotorcycle },
                { id: '2', label: 'Tuk Tuk', icon: faTaxi },
                { id: '3', label: 'Car', icon: faCar },
                { id: '4', label: 'Van', icon: faShuttleVan },
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`btn flex-fill d-flex align-items-center justify-content-center gap-2 ${formData.safariPackageId === id ? 'btn-success' : 'btn-outline-primary'}`}
                  onClick={() => setFormData((prev) => ({ ...prev, safariPackageId: id }))}
                >
                  <FontAwesomeIcon icon={icon} /> {label}
                </button>
              ))}
            </div>
          </div>

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
            {renderInputGroup(faCalendarDays, 'safariDate', 'date', '', formData.safariDate, true, null, getTodayDateString())}
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

export default CustomBookingForm;
