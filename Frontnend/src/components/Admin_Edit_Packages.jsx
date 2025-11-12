import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin_Edit_Packages.css'; 

const Admin_Edit_Packages = () => {
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({
    packageKey: "",
    packageName: "",
    packagePrice: ""
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/packages");
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const handleEditClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPackage({
      packageKey: "",
      packageName: "",
      packagePrice: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPackage((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/packages/${selectedPackage.packageKey}`,
        selectedPackage
      );
      fetchPackages();
      handleClose();
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  return (
    <div className="admin-container mt-4"
    style={{backgroundImage: 'url("/admin.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    color: '#ffffff',
    paddingBottom: '2rem',}}>
      <h3 className="mb-4 text-center mt-4">Edit Safari Package Price</h3>
      <Table striped bordered hover className="admin-table">
        <thead>
          <tr>
            <th>Package ID</th>
            <th>Package Name</th>
            <th>Package Price (USD $)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.packageKey}>
              <td>{pkg.packageKey}</td>
              <td>{pkg.packageName}</td>
              <td>{pkg.packagePrice}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditClick(pkg)}>
                  Edit Price
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Package Price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="packageName">
              <Form.Label>Package Name</Form.Label>
              <Form.Control
                type="text"
                name="packageName"
                value={selectedPackage.packageName}
                disabled
              />
            </Form.Group>

            <Form.Group controlId="packagePrice" className="mt-3">
              <Form.Label>Package Price (USD $)</Form.Label>
              <Form.Control
                type="number"
                name="packagePrice"
                value={selectedPackage.packagePrice}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Admin_Edit_Packages;
