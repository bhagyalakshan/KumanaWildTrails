import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AirportBookingForm = ({ packageDetails }) => {
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
  });

  const [bookingMessage, setBookingMessage] = useState('');
  const [messageType, setMessageType] = useState('');
const [loading, setLoading] = useState(false);

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'numKids' || name === 'numAdults') && value !== '') {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'numKids' || name === 'numAdults') {
        const kids = parseInt(name === 'numKids' ? value : updated.numKids || '0', 10) || 0;
        const adults = parseInt(name === 'numAdults' ? value : updated.numAdults || '0', 10) || 0;
        const amount = adults * packageDetails.packagePrice + kids * (packageDetails.packagePrice * 0.67);
        updated.totalAmount = amount.toFixed(2);
      }
      return updated;
    });
  };

  const handlePhoneKeyPress = (e) => {
    if (e.charCode < 48 || e.charCode > 57) e.preventDefault();
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


  return (
    <div className="w-100" style={{ maxWidth: '500px' }}>
      <div className="d-flex justify-content-center align-items-center gap-5 p-3 mb-4" style={{ backgroundColor: '#f8fdfd', borderRadius: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
        <div className="text-center">
          <div className="rounded-circle d-flex justify-content-center align-items-center mb-1" style={{ width: '40px', height: '40px', backgroundColor: '#d3f1f1' }}>
            <i className="bi bi-people-fill text-dark fs-5"></i>
          </div>
          <div style={{ fontSize: '0.95rem', color: '#004b4b' }}><strong>Adults:</strong> (Age: 12–99)</div>
        </div>
        <div className="text-center">
          <div className="rounded-circle d-flex justify-content-center align-items-center mb-1" style={{ width: '40px', height: '40px', backgroundColor: '#d3f1f1' }}>
            <i className="bi bi-person-fill text-dark fs-5"></i>
          </div>
          <div style={{ fontSize: '0.95rem', color: '#004b4b' }}><strong>Kids:</strong> (Age: 11 and Younger)</div>
        </div>
      </div>

      <div className="text-center mb-3 p-3 rounded-3" style={{ color: '#006400', backgroundColor: '#f8f9fa', fontWeight: 'bold', fontSize: '1.1rem', border: '3px solid #FFA500' }}>
        ${packageDetails.packagePrice.toFixed(2)}/per pax/07 hours
      </div>

      <form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
        <div className="row g-2 flex-grow-1">
          {}
          <div className="col-12 mb-3">
            <label className="form-label d-block">Select Vehicle Type</label>
            <div className="d-flex gap-3">
              <button type="button" className={`btn btn-outline-primary flex-fill d-flex align-items-center justify-content-center gap-2 ${formData.safariPackageId === '1' ? 'active' : ''}`} onClick={() => setFormData((prev) => ({ ...prev, safariPackageId: '1' }))}>
                <i className="bi bi-car-front-fill fs-4"></i> Car
              </button>
              <button type="button" className={`btn btn-outline-success flex-fill d-flex align-items-center justify-content-center gap-2 ${formData.safariPackageId === '2' ? 'active' : ''}`} onClick={() => setFormData((prev) => ({ ...prev, safariPackageId: '2' }))}>
                <i className="bi bi-truck-front-fill fs-4"></i> Van
              </button>
            </div>
          </div>

          {}
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
              <input type="text" name="guestName" className="form-control" value={formData.guestName} onChange={handleChange} required />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
              <input type="email" name="guestEmail" className="form-control" value={formData.guestEmail} onChange={handleChange} required />
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label">Phone</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
              <input type="tel" name="guestPhone" className="form-control" value={formData.guestPhone} onChange={handleChange} onKeyPress={handlePhoneKeyPress} required />
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label">Kids</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input type="number" name="numKids" className="form-control" value={formData.numKids} onChange={handleChange} min="0" />
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label">Adults</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-people-fill"></i></span>
              <input type="number" name="numAdults" className="form-control" value={formData.numAdults} onChange={handleChange} min="1" required />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Tour Date</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-calendar-event-fill"></i></span>
              <input type="date" name="safariDate" className="form-control" value={formData.safariDate} onChange={handleChange} required min={getTodayDateString()} />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Pickup Location</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-geo-alt-fill"></i></span>
              <input type="text" name="pickupLocation" className="form-control" value={formData.pickupLocation} onChange={handleChange} required />
            </div>
          </div>

          <div className="col-12 mb-2">
            <label className="form-label">Special Requests</label>
            <textarea name="specialRequests" className="form-control" rows="3" value={formData.specialRequests} onChange={handleChange}></textarea>
          </div>

          <div className="col-12 p-3 text-center rounded-3" style={{ backgroundColor: '#f8f9fa', color: '#006400', fontWeight: 'bold', border: '3px solid #FFA500' }}>
            ${formData.totalAmount}
            <div className="text-muted small">Total Amount</div>
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

export default AirportBookingForm;
