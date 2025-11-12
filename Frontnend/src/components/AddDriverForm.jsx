import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDriverForm = ({ showAlert }) => {
  const [driver, setDriver] = useState({
    name: '',
    licenseNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    vehicleType: '',
    vehicleNumber: '',
    password: '',
    role: 'DRIVER'
  });
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');

  // Check email availability
  useEffect(() => {
    if (driver.email) {
      fetch(`http://localhost:8080/api/users/check-email?email=${encodeURIComponent(driver.email)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          if (data.exists) {
            setEmailError('Please check your email - this email is already registered.');
          } else {
            setEmailError('');
          }
        })
        .catch(error => {
          console.error('Error checking email:', error);
          setEmailError('Please check your email - error checking availability.');
        });
    } else {
      setEmailError('');
    }
  }, [driver.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriver({ ...driver, [name]: value });
    if (formError) setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (emailError) {
      showAlert(emailError, 'danger');
      return;
    }

    const userData = {
      name: driver.name,
      email: driver.email,
      password: driver.password,
      role: driver.role
    };

    const driverData = {
      licenseNumber: driver.licenseNumber,
      phoneNumber: driver.phoneNumber,
      address: driver.address,
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber,
      status: 'Available'
    };

    fetch('http://localhost:8080/api/drivers/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userData, driver: driverData })
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Please check your email or form data.');
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        showAlert("Driver and User added successfully!", "success");
        setDriver({
          name: '',
          licenseNumber: '',
          phoneNumber: '',
          email: '',
          address: '',
          vehicleType: '',
          vehicleNumber: '',
          password: '',
          role: 'DRIVER'
        });
        setEmailError('');
        setFormError('');
      })
      .catch(error => {
        console.error('Error:', error.message);
        setFormError('Please check your email or form data.');
        showAlert(`Error adding user and driver: ${error.message}`, "danger");
      });
  };

  return (
    <>
      <style>
        {`
          .form-container {
            background-color: #1a202c;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          .custom-input {
            background-color: #2d3748;
            color: #e2e8f0;
            border: 1px solid #4a5568;
            border-radius: 6px;
            padding: 10px;
            width: 100%;
            transition: border-color 0.3s, box-shadow 0.3s;
          }
          .custom-input:focus {
            border-color: #63b3ed;
            box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.3);
            outline: none;
          }
          .custom-select {
            background-color: #2d3748;
            color: #e2e8f0;
            border: 1px solid #4a5568;
            border-radius: 6px;
            padding: 10px;
            width: 100%;
            appearance: none;
            transition: border-color 0.3s, box-shadow 0.3s;
          }
          .custom-select:focus {
            border-color: #63b3ed;
            box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.3);
            outline: none;
          }
          .custom-button {
            background-color: #3182ce;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 6px;
            border: none;
            font-weight: 600;
            transition: background-color 0.3s;
          }
          .custom-button:hover {
            background-color: #2b6cb0;
          }
          .custom-button:disabled {
            background-color: #718096;
            cursor: not-allowed;
          }
          .error-message {
            color: #f56565;
            font-size: 0.875rem;
            margin-top: 4px;
          }
        `}
      </style>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="alert alert-danger text-center mb-4" role="alert">
              {formError}
            </div>
          )}
          <div className="row g-3">
            {[
              { label: 'Name', name: 'name', type: 'text' },
              { label: 'License Number', name: 'licenseNumber', type: 'text' },
              { label: 'Phone Number', name: 'phoneNumber', type: 'text' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Address', name: 'address', type: 'text' },
              { label: 'Vehicle Number', name: 'vehicleNumber', type: 'text' },
            ].map((field) => (
              <div className="col-md-6" key={field.name}>
                <label className="form-label text-white">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={driver[field.name]}
                  onChange={handleChange}
                  className="custom-input"
                  required
                />
                {field.name === 'email' && emailError && <div className="error-message">{emailError}</div>}
              </div>
            ))}

            <div className="col-md-6">
              <label className="form-label text-white">Vehicle Type</label>
              <select
                name="vehicleType"
                value={driver.vehicleType}
                onChange={handleChange}
                className="custom-select"
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="Mahindra Normal Jeep">Mahindra Normal Jeep</option>
                <option value="Mahindra 4x4 Jeep">Mahindra 4x4 Jeep</option>
                <option value="Other 4x4 Jeep">Other 4x4 Jeep</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label text-white">Password</label>
              <input
                type="password"
                name="password"
                value={driver.password}
                onChange={handleChange}
                className="custom-input"
                required
                 autoComplete="off" 
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="custom-button"
              disabled={!!emailError}
            >
              Add Driver
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddDriverForm;