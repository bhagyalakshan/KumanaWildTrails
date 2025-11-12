import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from 'react-bootstrap';
import {
  faPhone,
  faMapMarkerAlt,
  faBoxOpen,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
const token = localStorage.getItem('token');

const TabsWithPinnedCollapsedMenu = ({ tabs, tabLabels, activeTab, setActiveTab }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1050);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1050);
      if (window.innerWidth >= 1050) setOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="container-fluid p-3 shadow-sm"
      style={{
        backgroundColor: 'rgba(2, 8, 29, 0.9)',
        backdropFilter: 'blur(5px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1050,
      }}
    >
      {!isMobile && (
        <div className="d-flex justify-content-center flex-wrap gap-3 py-3 border-bottom border-light">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                color: activeTab === tab ? '#f9fefdff' : '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.7rem 1.6rem',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                background: activeTab === tab
                  ? 'linear-gradient(135deg, #043931ff 0%, #008080 100%)'
                  : 'transparent',
                boxShadow: activeTab === tab
                  ? '0 6px 16px rgba(0, 209, 178, 0.1)'
                  : 'none',
                flex: '1 0 180px',
                textAlign: 'center',
                userSelect: 'none',
                userDrag: 'none',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tabLabels[tab]}
            </div>
          ))}
        </div>
      )}

      {isMobile && (
        <div className="border-bottom border-light">
          <button
            className="btn btn-outline-light w-100 d-flex justify-content-between align-items-center"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-tab-collapse"
            style={{ borderRadius: '10px', fontWeight: 600 }}
          >
            {tabLabels[activeTab]}
            <span style={{ fontSize: '1.3rem', userSelect: 'none' }}>
              {open ? '▲' : '▼'}
            </span>
          </button>
          <Collapse in={open}>
            <div id="mobile-tab-collapse" className="mt-2">
              <div className="d-flex flex-column gap-2">
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setOpen(false);
                    }}
                    style={{
                      color: activeTab === tab ? '#f2f5f5ff' : '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: activeTab === tab
                        ? 'linear-gradient(135deg, #023730ff 0%, #00796b 100%)'
                        : 'transparent',
                      boxShadow: activeTab === tab
                        ? '0 4px 12px rgba(4, 60, 60, 0.35)'
                        : 'none',
                      transition: 'all 0.3s ease',
                      userSelect: 'none',
                      userDrag: 'none',
                      textAlign: 'center',
                    }}
                  >
                    {tabLabels[tab]}
                  </div>
                ))}
              </div>
            </div>
          </Collapse>
        </div>
      )}
    </div>
  );
};

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [driverLoading, setDriverLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/bookings')
      .then((response) => response.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
  }, []);

  const fetchDrivers = async () => {
    setDriverLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/drivers/getActiveDrivers', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched drivers:', data); // Debugging
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers([]);
    } finally {
      setDriverLoading(false);
    }
  };

  const handleRejectBooking = () => {
    if (!rejectReason.trim()) {
      alert('Please enter a reason.');
      return;
    }

    fetch(`http://localhost:8080/api/bookings/${selectedBooking.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: rejectReason }),
    })
      .then((res) => {
        if (res.ok) {
          setBookings((prev) =>
            prev.map((b) =>
              b.id === selectedBooking.id
                ? { ...b, status: 'rejected', assignedDriver: rejectReason }
                : b
            )
          );
          setShowRejectModal(false);
          setSelectedBooking(null);
          setRejectReason('');
        } else {
          console.error('Failed to reject booking');
        }
      })
      .catch((err) => console.error(err));
  };

  const generateMessage = (packageName, packageId) => {
    if (!packageName || packageId == null) return '';

    if (packageName === 'Kumana National Park Safari Tour') {
      switch (packageId) {
        case 1:
          return 'Full Day';
        case 2:
          return 'Morning';
        case 3:
          return 'Evening';
        case 4:
          return 'Birdwatching';
        default:
          return '';
      }
    } else if (packageName === 'Surfing Lessons in Arugumbay') {
      switch (packageId) {
        case 1:
          return 'Arugumbay';
        case 2:
          return 'Peanut farm';
        case 3:
          return 'Panama';
        default:
          return '';
      }
    } else if (packageName === 'Airport Transport service') {
      switch (packageId) {
        case 1:
          return 'Car';
        case 2:
          return 'Van';
        default:
          return '';
      }
    } else if (packageName.startsWith('Tuk Tuk')) {
      switch (packageId) {
        case 0:
          return 'Tuk Tuk Hire (Not a round trip)';
        case 1:
          return 'Round trip Tuk Tuk Hire';
        default:
          return '';
      }
    } else {
      switch (packageId) {
        case 1:
          return 'Bike Custom Tour';
        case 2:
          return 'Tuk Tuk Custom Tour';
        case 3:
          return 'Car Custom Tour';
        case 4:
          return 'Van Custom Tour';
        default:
          return '';
      }
    }
  };

  const handleMarkAsChecked = (booking) => {
    fetch(`http://localhost:8080/api/bookings/${booking.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'checked' }),
    })
      .then((response) => {
        if (response.ok) {
          setBookings((prevBookings) =>
            prevBookings.map((b) =>
              b.id === booking.id ? { ...b, status: 'checked' } : b
            )
          );
          setSelectedBooking(null);
        } else {
          console.error('Failed to update status');
        }
      })
      .catch((error) => console.error('Error updating status:', error));
  };

  const handleAssignDriver = (driver, bookingId) => {
    fetch(`http://localhost:8080/api/bookings/${bookingId}/assign-driver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        driverName: driver.name,
        driverPhoneNumber: driver.phoneNumber,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setShowDriverModal(false);
          setSelectedBooking(null);
          setBookings((prevBookings) =>
            prevBookings.map((b) =>
              b.id === bookingId
                ? {
                    ...b,
                    status: 'assigned',
                    assignedDriver: driver.name + ' - ' + driver.phoneNumber,
                  }
                : b
            )
          );
        } else {
          console.error('Failed to assign driver');
        }
      })
      .catch((error) => {
        console.error('Error assigning driver:', error);
      });
  };

  const getCardBorderColor = () => {
    switch (activeTab) {
      case 'new':
        return 'green';
      case 'checked':
        return '#FFD700';
      case 'assigned':
        return '#ADD8E6';
      case 'rejected':
        return '#8B0000';
      case 'previous':
        return '';
      default:
        return '';
    }
  };

  const tabLabels = {
    new: 'New Bookings',
    checked: 'Checked Bookings',
    assigned: 'Assigned Bookings',
    previous: 'Bookings History',
    rejected: 'Rejected Bookings',
  };

  const renderBookingCard = (booking) => {
    const message = generateMessage(booking.safariPackageName, booking.safariPackageId);

    return (
      <div
        key={booking.id}
        onClick={() => setSelectedBooking(booking)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '25px',
          marginBottom: '16px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
          cursor: 'pointer',
          color: '#2c3e50',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.18)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <h4
            style={{
              fontWeight: '900',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FontAwesomeIcon icon={faBoxOpen} style={{ color: '#00bcd4' }} />
            {booking.safariPackageName}
          </h4>
          {message && (
            <p style={{ fontWeight: '600', color: '#00796b', marginBottom: '8px' }}>
              Sub Package: <span style={{ fontWeight: '700' }}>({message}) Booking</span>
            </p>
          )}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              color: '#555',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FontAwesomeIcon icon={faPhone} style={{ color: 'green' }} />
              <span>{booking.guestPhone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'red' }} />
              <span>{booking.pickupLocation}</span>
            </div>
            {activeTab === 'assigned' && booking.assignedDriver && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#0288d1',
                  fontWeight: '600',
                }}
              >
                <FontAwesomeIcon icon={faUserTie} />
                <span>{booking.assignedDriver}</span>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #cfd8dc',
            paddingTop: '12px',
            marginTop: 'auto',
          }}
        >
          <span style={{ fontWeight: '900', fontSize: '0.95rem' }}>
            Safari Date: <strong>{booking.safariDate}</strong>
          </span>
          <Button
            variant="info"
            size="sm"
            style={{
              backgroundColor: '#00bcd4',
              borderColor: '#00bcd4',
              fontWeight: '700',
              boxShadow: 'none',
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Review
          </Button>
        </div>
      </div>
    );
  };

  const [selectedPackage, setSelectedPackage] = useState(null);

  const renderAssignedGroupedCards = () => {
    const isMobile = window.innerWidth < 1050;
    const assignedBookings = bookings.filter((b) => b.status === 'assigned');

    if (assignedBookings.length === 0) {
      return (
        <div className="text-center py-5">
          <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#555' }}>
            No assigned bookings yet.
          </p>
        </div>
      );
    }

    const packageNames = [...new Set(assignedBookings.map((b) => b.safariPackageName || 'Unknown Package'))];

    const filteredBookings = selectedPackage
      ? assignedBookings.filter((b) => (b.safariPackageName || 'Unknown Package') === selectedPackage)
      : assignedBookings;

    const groupedByPackage = filteredBookings.reduce((acc, booking) => {
      const packageName = booking.safariPackageName || 'Unknown Package';
      if (!acc[packageName]) acc[packageName] = [];
      acc[packageName].push(booking);
      return acc;
    }, {});

    return (
      <div className="container">
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: '#fff',
            padding: '10px 10px',
            borderBottom: '1.5px solid #e0e0e0',
            display: 'flex',
            overflowX: 'auto',
            gap: '5px',
            whiteSpace: 'nowrap',
            marginBottom: '30px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
          }}
        >
          <button
            onClick={() => setSelectedPackage(null)}
            style={{
              padding: '2px 8px',
              borderRadius: '25px',
              border: '2px solid #00bcd4',
              backgroundColor: selectedPackage === null ? '#00bcd4' : 'transparent',
              color: selectedPackage === null ? '#fff' : '#00bcd4',
              fontWeight: '400',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              boxShadow: selectedPackage === null ? '0 4px 12px rgba(0, 188, 212, 0.4)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (selectedPackage !== null) e.currentTarget.style.backgroundColor = '#e0f7fa';
            }}
            onMouseLeave={(e) => {
              if (selectedPackage !== null) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            All Packages
          </button>

          {packageNames.map((pkg) => (
            <button
              key={pkg}
              onClick={() => setSelectedPackage(pkg)}
              style={{
                padding: '2px 8px',
                borderRadius: '25px',
                border: '2px solid #00bcd4',
                backgroundColor: selectedPackage === pkg ? '#00bcd4' : 'transparent',
                color: selectedPackage === pkg ? '#fff' : '#00bcd4',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                boxShadow: selectedPackage === pkg ? '0 4px 12px rgba(0, 188, 212, 0.4)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (selectedPackage !== pkg) e.currentTarget.style.backgroundColor = '#e0f7fa';
              }}
              onMouseLeave={(e) => {
                if (selectedPackage !== pkg) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {pkg}
            </button>
          ))}
        </div>

        {Object.entries(groupedByPackage).map(([packageName, bookingsForPackage]) => {
          const groupedBySubPackage = bookingsForPackage.reduce((acc, booking) => {
            const subPackage =
              generateMessage(booking.safariPackageName, booking.safariPackageId) || 'No Sub Package';
            if (!acc[subPackage]) acc[subPackage] = [];
            acc[subPackage].push(booking);
            return acc;
          }, {});

          return (
            <div
              key={packageName}
              className="mb-5 p-5"
              style={{
                background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
                borderRadius: '20px',
                boxShadow: '0 12px 28px rgba(0,0,0,0.07)',
                border: '1px solid #e1e8f0',
              }}
            >
              <h3
                className="mb-5 text-center"
                style={{
                  fontWeight: '900',
                  color: '#1a394f',
                  borderBottom: '3px solid #00bcd4',
                  paddingBottom: '12px',
                  letterSpacing: '1.2px',
                  fontSize: isMobile ? '1.2rem' : '1.9rem',
                }}
              >
                {packageName}
              </h3>

              {Object.entries(groupedBySubPackage).map(([subPackage, bookingsList]) => (
                <div key={subPackage} className="mb-5">
                  <h5
                    className="mb-4"
                    style={{
                      fontWeight: '700',
                      color: '#00675b',
                      paddingLeft: '12px',
                      fontSize: isMobile ? '1rem' : '1.25rem',
                      borderLeft: '4px solid #00bcd4',
                      marginBottom: '1rem',
                    }}
                  >
                    {subPackage}
                  </h5>

                  <div className="row g-4">
                    {bookingsList.map((booking) => renderBookingCard(booking))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderRejectModal = () => {
    return (
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Reason for Rejection:</label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="form-control"
            rows={4}
            placeholder="Type reason here..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleRejectBooking}
            style={{ backgroundColor: 'red', border: 'none' }}
          >
            Reject & Notify
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderModal = () => {
    if (!selectedBooking) return null;

    return (
      <Modal show onHide={() => setSelectedBooking(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>ID:</strong> {selectedBooking.id}
          </p>
          <p>
            <strong>Guest Name:</strong> {selectedBooking.guestName}
          </p>
          <p>
            <strong>Email:</strong> {selectedBooking.guestEmail}
          </p>
          <p>
            <strong>Phone:</strong> {selectedBooking.guestPhone}
          </p>
          <p>
            <strong>Num Kids:</strong> {selectedBooking.numKids}
          </p>
          <p>
            <strong>Num Adults:</strong> {selectedBooking.numAdults}
          </p>
          <p>
            <strong>Safari Date:</strong> {selectedBooking.safariDate}
          </p>
          <p>
            <strong>Pickup Location:</strong> {selectedBooking.pickupLocation}
          </p>
          <p>
            <strong>Special Requests:</strong> {selectedBooking.specialRequests}
          </p>
          <p>
            <strong>Total Amount:</strong> {selectedBooking.totalAmount}
          </p>
          <p>
            <strong>Payment Status:</strong> {selectedBooking.paymentStatus}
          </p>
          <p>
            <strong>Booking Date:</strong> {selectedBooking.bookingDate}
          </p>
          <p>
            <strong>Package:</strong> {selectedBooking.safariPackageName}
          </p>
          <p>
            <strong>Status:</strong> {selectedBooking.status}
          </p>
        </Modal.Body>
        <Modal.Footer>
          {(activeTab === 'new' || activeTab === 'checked') && (
            <Button
              variant="warning"
              onClick={() => {
                fetchDrivers();
                setShowDriverModal(true);
              }}
              style={{ backgroundColor: '#00bfff', borderColor: '#00bfff', color: 'white' }}
            >
              Assign Driver
            </Button>
          )}
          {activeTab === 'new' && (
            <Button
              variant="success"
              onClick={() => handleMarkAsChecked(selectedBooking)}
              style={{ backgroundColor: 'orange', border: 'none' }}
            >
              Mark as Checked
            </Button>
          )}
          <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
            Close
          </Button>
          {(activeTab === 'new' || activeTab === 'checked') && (
            <Button
              variant="danger"
              onClick={() => setShowRejectModal(true)}
              style={{ backgroundColor: 'red', border: 'none' }}
            >
              Reject Booking
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  };

  const renderDriverModal = () => {
    const defaultDriverImg = '/assets/driver.png';

    return (
      <Modal
        show={showDriverModal}
        onHide={() => setShowDriverModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            style={{ fontWeight: '700', fontSize: '1.5rem', letterSpacing: '0.05em' }}
          >
            Select Driver
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-4">
            {driverLoading ? (
              <p className="text-center text-muted fs-5 mt-4">Loading drivers...</p>
            ) : drivers.length === 0 ? (
              <p className="text-center text-muted fs-5 mt-4">
                No drivers available
              </p>
            ) : drivers.filter((driver) => driver.status.toLowerCase() === 'available').length === 0 ? (
              <p className="text-center text-muted fs-5 mt-4">
                No available drivers at the moment
              </p>
            ) : (
              drivers
                .filter((driver) => driver.status.toLowerCase() === 'available')
                .map((driver) => (
                  <div className="col-12 col-md-6" key={driver.id}>
                    <div
                      className="card h-100 shadow-sm text-center p-4"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #00bfff',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 20px rgba(0,191,255,0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 1px 5px rgba(0,0,0,0.1)';
                      }}
                    >
                      <img
                        src={defaultDriverImg}
                        alt="Driver"
                        className="mx-auto mb-3"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        }}
                      />
                      <h5 className="mb-2" style={{ fontWeight: '700', color: '#0077b6' }}>
                        {driver.name}
                      </h5>
                      <p className="mb-1" style={{ fontSize: '1rem', color: '#555' }}>
                        📞 {driver.phoneNumber}
                      </p>
                      <p className="mb-3" style={{ fontSize: '1rem', color: '#555' }}>
                        📍 {driver.address}
                      </p>
                      <p className="mb-4">
                        Status:{' '}
                        <span
                          style={{
                            backgroundColor: '#007f5f',
                            color: 'white',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            letterSpacing: '0.03em',
                            userSelect: 'none',
                          }}
                        >
                          {driver.status}
                        </span>
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => handleAssignDriver(driver, selectedBooking.id)}
                        className="w-100"
                        style={{
                          backgroundColor: '#00bfff',
                          borderColor: '#00bfff',
                          fontWeight: '600',
                          padding: '0.55rem 0',
                          fontSize: '1rem',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,191,255,0.4)',
                          transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = '#009acd')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = '#00bfff')
                        }
                      >
                        Assign
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowDriverModal(false)}
            style={{ fontWeight: '600' }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'new') return b.status === 'new';
    if (activeTab === 'checked') return b.status === 'checked';
    if (activeTab === 'assigned') return b.status === 'assigned';
    if (activeTab === 'previous') return b.status === 'assigned';
    if (activeTab === 'rejected') return b.status === 'rejected';
    return false;
  });

  const renderCards = (data) => {
    if (data.length === 0) {
      return <p className="text-center fw-bold">No bookings yet.</p>;
    }
    return <div className="row">{data.map((booking) => renderBookingCard(booking))}</div>;
  };

  const renderHistoryTable = () => {
    if (filteredBookings.length === 0) {
      return (
        <div className="text-center mt-5">
          <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#555' }}>
            No assigned bookings to show.
          </p>
        </div>
      );
    }

    const sortedBookings = [...filteredBookings].sort(
      (a, b) => new Date(b.safariDate) - new Date(a.safariDate)
    );

    return (
      <div className="table-responsive mt-4">
        <Table
          bordered
          hover
          className="shadow-sm"
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#fefefe',
            boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
          }}
        >
          <thead
            style={{
              background: '#00bcd4',
              color: '#fff',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            <tr>
              <th style={{ padding: '12px' }}>Guest Name</th>
              <th style={{ padding: '12px' }}>Package</th>
              <th style={{ padding: '12px' }}>Pickup Location</th>
              <th style={{ padding: '12px' }}>Assigned Driver</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((booking) => (
              <tr key={booking.id} style={{ verticalAlign: 'middle' }}>
                <td style={{ padding: '10px' }}>{booking.guestName}</td>
                <td style={{ padding: '10px' }}>{booking.safariPackageName}</td>
                <td style={{ padding: '10px' }}>{booking.pickupLocation}</td>
                <td style={{ padding: '10px' }}>{booking.assignedDriver || '-'}</td>
                <td style={{ padding: '10px' }}>
                  <span
                    style={{
                      backgroundColor: booking.status === 'assigned' ? '#c8e6c9' : '#ffe0b2',
                      color: booking.status === 'assigned' ? '#256029' : '#8a6d3b',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}
                  >
                    {booking.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => setSelectedBooking(booking)}
                    style={{
                      fontWeight: '600',
                      backgroundColor: '#00bcd4',
                      borderColor: '#00bcd4',
                      borderRadius: '6px',
                    }}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const tabs = ['new', 'checked', 'assigned', 'previous', 'rejected'];

  return (
    <div
      style={{
        backgroundImage: 'url("/admin.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: '#ffffff',
        paddingBottom: '2rem',
      }}
    >
      <TabsWithPinnedCollapsedMenu
        tabs={tabs}
        tabLabels={tabLabels}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="container mt-5">
        {loading ? (
          <p className="text-center fw-bold">Loading...</p>
        ) : (
          <>
            {activeTab === 'assigned' ? (
              <>
                <div style={{ height: '5rem' }} />
                {renderAssignedGroupedCards()}
              </>
            ) : activeTab !== 'previous' ? (
              <>
                <div style={{ height: '5rem' }} />
                {renderCards(filteredBookings)}
              </>
            ) : (
              <>
                <div style={{ height: '6rem' }} />
                {renderHistoryTable()}
              </>
            )}
          </>
        )}
      </div>

      {renderModal()}
      {renderDriverModal()}
      {renderRejectModal()}
    </div>
  );
};

export default BookingTable;