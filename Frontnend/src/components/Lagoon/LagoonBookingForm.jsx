import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const LagoonBookingForm = ({ packageDetails }) => {
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
  });

  const [bookingMessage, setBookingMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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
      pickupLocation: 'Panama lagoon',
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
      });
    } catch (error) {
      console.error('Booking failed:', error);
      setBookingMessage('❌ Booking Failed. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="w-100" style={{ maxWidth: '500px' }}>
      {/* Icons Section */}
      <div className="d-flex justify-content-center align-items-center gap-5 p-3 mb-4 bg-light rounded-3 shadow-sm">
        <div className="text-center">
          <div className="rounded-circle bg-info-subtle d-flex justify-content-center align-items-center mb-1" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-people-fill text-dark fs-5"></i>
          </div>
          <div style={{ fontSize: '0.95rem', color: '#004b4b' }}>
            <strong>Adults:</strong> (Age: 12–99)
          </div>
        </div>
        <div className="text-center">
          <div className="rounded-circle bg-info-subtle d-flex justify-content-center align-items-center mb-1" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-person-fill text-dark fs-5"></i>
          </div>
          <div style={{ fontSize: '0.95rem', color: '#004b4b' }}>
            <strong>Kids:</strong> (Age: 11 and Younger)
          </div>
        </div>
      </div>

      <div className="text-center mb-3 p-3 rounded-3 fw-bold" style={{ backgroundColor: '#f8f9fa', border: '3px solid #FFA500', color: '#006400' }}>
        ${packageDetails.packagePrice.toFixed(2)}/per pax/07 hours
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-2">
          {/* Name */}
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
              <input type="text" name="guestName" className="form-control" value={formData.guestName} onChange={handleChange} required />
            </div>
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
              <input type="email" name="guestEmail" className="form-control" value={formData.guestEmail} onChange={handleChange} required />
            </div>
          </div>

          {/* Phone */}
          <div className="col-md-4">
            <label className="form-label">Phone</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
              <input type="tel" name="guestPhone" className="form-control" value={formData.guestPhone} onChange={handleChange} onKeyPress={handlePhoneKeyPress} required />
            </div>
          </div>

          {/* Kids */}
          <div className="col-md-4">
            <label className="form-label">Kids</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input type="number" name="numKids" className="form-control" value={formData.numKids} onChange={handleChange} min="0" />
            </div>
          </div>

          {/* Adults */}
          <div className="col-md-4">
            <label className="form-label">Adults</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-people-fill"></i></span>
              <input type="number" name="numAdults" className="form-control" value={formData.numAdults} onChange={handleChange} min="1" required />
            </div>
          </div>

          {/* Date */}
          <div className="col-md-6">
            <label className="form-label">Tour Date</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-calendar-event-fill"></i></span>
              <input type="date" name="safariDate" className="form-control" value={formData.safariDate} onChange={handleChange} required min={getTodayDateString()} />
            </div>
          </div>

          {/* Location (read only) */}
          <div className="col-md-6">
            <label className="form-label">Location</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-geo-alt-fill"></i></span>
              <input className="form-control" value="Pottuvil lagoon" readOnly />
            </div>
          </div>

          {/* Special Requests */}
          <div className="col-12 mb-2">
            <label className="form-label">Special Requests</label>
            <textarea name="specialRequests" className="form-control" rows="3" value={formData.specialRequests} onChange={handleChange}></textarea>
          </div>

          {/* Total Amount */}
          <div className="col-12 text-center p-3 rounded-3 fw-bold" style={{ backgroundColor: '#f8f9fa', border: '3px solid #FFA500', color: '#006400' }}>
            ${formData.totalAmount}
            <div className="text-muted small">Total Amount</div>
          </div>

          {/* Submit */}
          <div className="col-12">
            <button type="submit" className="btn btn-success w-100">
              <i className="bi bi-calendar-check-fill me-2"></i>
              Book Now
            </button>
          </div>

          {/* Message */}
          {bookingMessage && (
            <div className={`text-center mt-2 ${messageType === 'success' ? 'text-success' : 'text-danger'}`}>
              {bookingMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LagoonBookingForm;
