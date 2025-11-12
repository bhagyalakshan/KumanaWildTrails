import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const BookingForm = ({ packageDetails }) => {
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
    jeepCount: 0,

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

  const safariPackages = [
    { id: 1, name: 'Full Day Safari' },
    { id: 2, name: 'Morning Safari' },
    { id: 3, name: 'Evening Safari' },
    { id: 4, name: 'Birdwatching Safari' },
  ];

  const handleChange = (e) => {
  const { name, value } = e.target;

  if ((name === 'numKids' || name === 'numAdults') && value !== '') {
    if (!/^\d*$/.test(value)) return;
  }

  setFormData((prev) => {
    const updated = { ...prev, [name]: value };

    const numAdults = parseInt(name === 'numAdults' ? value : updated.numAdults || '0', 10) || 0;
    const numKids = parseInt(name === 'numKids' ? value : updated.numKids || '0', 10) || 0;
    const totalPeople = numAdults + numKids;
    const selectedPackageId = parseInt(name === 'safariPackageId' ? value : updated.safariPackageId || '0', 10);

    const fullDayPricing = [0, 150, 200, 240, 270, 300, 325, 350];
    const otherPricing = [0, 85, 105, 125, 145, 163, 180, 196];

    const priceArray = selectedPackageId === 1 ? fullDayPricing : otherPricing;

    let totalAmount = 0;
    let peopleRemaining = totalPeople;
    let jeepCount = 0;

    while (peopleRemaining > 0) {
      const groupSize = Math.min(7, peopleRemaining);
      totalAmount += priceArray[groupSize];
      jeepCount++;
      peopleRemaining -= groupSize;
    }

    updated.totalAmount = totalAmount.toFixed(2);
    updated.jeepCount = jeepCount;

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
      {/* Age Info */}
      <div className="d-flex justify-content-center align-items-center gap-5 p-3 mb-4" style={{ backgroundColor: '#f8fdfd', borderRadius: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
        <div className="text-center">
          <div className="rounded-circle d-flex justify-content-center align-items-center mb-1" style={{ width: '40px', height: '40px', backgroundColor: '#d3f1f1' }}>
            <i className="bi bi-people-fill text-dark fs-5"></i>
          </div>
          <div style={{ fontSize: '0.95rem', color: '#004b4b' }}>
            <strong>Adults:</strong> (12–99)
          </div>
        </div>
        <div className="text-center">
          <div className="rounded-circle d-flex justify-content-center align-items-center mb-1" style={{ width: '40px', height: '40px', backgroundColor: '#d3f1f1' }}>
            <i className="bi bi-person-fill text-dark fs-5"></i>
          </div>
          <div style={{ fontSize: '0.95rem', color: '#004b4b' }}>
            <strong>Kids:</strong> (6–11)
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-center mb-3 p-3 rounded-3" style={{ color: '#006400', backgroundColor: '#f8f9fa', fontWeight: 'bold', fontSize: '1.1rem', border: '3px solid #FFA500' }}>
        ${packageDetails.packagePrice.toFixed(2)}/per pax/07 hours
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
        <div className="row g-2 flex-grow-1">
          {/* Safari Package */}
          <div className="col-12 mb-2">
            <label className="form-label">Safari Package</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-binoculars-fill"></i></span>
              <select
                name="safariPackageId"
                value={formData.safariPackageId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a Safari Package</option>
                {safariPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Full Name */}
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person-circle"></i></span>
              <input
                type="text"
                name="guestName"
                className="form-control"
                value={formData.guestName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
              <input
                type="email"
                name="guestEmail"
                className="form-control"
                value={formData.guestEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="col-md-4">
            <label className="form-label">Phone</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
              <input
                type="tel"
                name="guestPhone"
                className="form-control"
                value={formData.guestPhone}
                onChange={handleChange}
                onKeyPress={handlePhoneKeyPress}
                required
              />
            </div>
          </div>

          {/* Kids */}
          <div className="col-md-4">
            <label className="form-label">Kids</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input
                type="number"
                name="numKids"
                className="form-control"
                value={formData.numKids}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          {/* Adults */}
          <div className="col-md-4">
            <label className="form-label">Adults</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-people"></i></span>
              <input
                type="number"
                name="numAdults"
                className="form-control"
                value={formData.numAdults}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          {/* Safari Date */}
          <div className="col-md-6">
            <label className="form-label">Tour Date</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-calendar-event-fill"></i></span>
              <input
                type="date"
                name="safariDate"
                className="form-control"
                value={formData.safariDate}
                onChange={handleChange}
                min={getTodayDateString()}
                required
              />
            </div>
          </div>

          {/* Pickup Location */}
          <div className="col-md-6">
            <label className="form-label">Pickup Location</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-geo-alt-fill"></i></span>
              <input
                type="text"
                name="pickupLocation"
                className="form-control"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="col-12 mb-2">
            <label className="form-label">Special Requests</label>
            <textarea
              name="specialRequests"
              className="form-control"
              rows="4"
              value={formData.specialRequests}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Total Amount */}
  <div
  className="col-12 p-3 text-center rounded-3"
  style={{
    backgroundColor: '#f8f9fa',
    color: '#006400',
    fontWeight: 'bold',
    border: '3px solid #FFA500',
  }}
>
  <div style={{ fontSize: '1.2rem' }}>
    Total Amount: <span style={{ color: 'goldenrod' }}>${formData.totalAmount}</span>
  </div>

  {formData.jeepCount > 0 && (
    <div className="text-muted small mt-1">
      🚙 Safari Jeeps Needed: <strong>{formData.jeepCount}</strong>
    </div>
  )}
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

export default BookingForm;
