import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Image,
  Modal
} from 'react-bootstrap';

const AdminBlogAdd = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, message: '', error: false });
  const [blogs, setBlogs] = useState([]);

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editStatus, setEditStatus] = useState({ loading: false, message: '', error: false });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchBlogs = () => {
    axios.get('http://localhost:8080/api/blogs').then((res) => {
      const updated = res.data.map((blog) => ({
        ...blog,
        imageUrl: `http://localhost:8080/api/blogs/image/${blog.id}`,
      }));
      setBlogs(updated);
    });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', imageFile);

    try {
      await axios.post('http://localhost:8080/api/blogs', formData);
      setStatus({ loading: false, message: 'Blog uploaded successfully!', error: false });
      setTitle('');
      setDescription('');
      setImageFile(null);
      document.getElementById('blog-image').value = null;
      fetchBlogs();
    } catch (error) {
      setStatus({ loading: false, message: 'Failed to upload blog.', error: true });
    }
  };

  const handleOpenModal = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
    setShowEditForm(false);
    setEditStatus({ loading: false, message: '', error: false });
  };

  const handleUpdate = async () => {
    setEditStatus({ loading: true, message: '', error: false });
    const formData = new FormData();
    formData.append('title', selectedBlog.title);
    formData.append('description', selectedBlog.description);
    if (imageFile) formData.append('image', imageFile);

    try {
      await axios.put(`http://localhost:8080/api/blogs/${selectedBlog.id}`, formData);
      setEditStatus({ loading: false, message: 'Blog updated successfully!', error: false });
      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      setEditStatus({ loading: false, message: 'Failed to update blog.', error: true });
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/blogs/${selectedBlog.id}`);
      setShowDeleteConfirm(false);
      setShowModal(false);
      fetchBlogs();
      setStatus({ loading: false, message: 'Blog deleted successfully!', error: false });
    } catch (err) {
      setShowDeleteConfirm(false);
      setEditStatus({ loading: false, message: 'Failed to delete blog.', error: true });
    }
  };

  return (
    <div style={{ backgroundImage: 'url("/admin.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    color: '#ffffff',
    paddingBottom: '2rem',color : 'black', paddingTop: '50px', paddingBottom: '50px' }}>
      <Container>
        <div className="text-center mb-4">
          <h2 style={{ color: '#f8f9fa', fontWeight: 'bold' }}>Create a Blog</h2>
        </div>

   <Form 
  onSubmit={handleSubmit}
  className="p-5 shadow-lg rounded-4 mx-auto"
  style={{ 
    background: 'rgba(255, 255, 255, 0.95)', 
    maxWidth: '700px', 
    width: '100%',
    border: '1px solid #e0e0e0'
  }}
>
  {/* Title */}
  <Form.Group className="mb-4">
    <Form.Label className="fw-semibold text-dark">Blog Title</Form.Label>
    <Form.Control
      type="text"
      value={title}
      className="rounded-3 shadow-sm"
      style={{ backgroundColor: '#f9f9f9', color: '#000' }}
      onChange={(e) => setTitle(e.target.value)}
      required
      placeholder="Enter blog title..."
    />
  </Form.Group>

  {/* Description */}
  <Form.Group className="mb-4">
    <Form.Label className="fw-semibold text-dark">Content</Form.Label>
    <Form.Control
      as="textarea"
      rows={5}
      className="rounded-3 shadow-sm"
      style={{ backgroundColor: '#f9f9f9', color: '#000' }}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
      placeholder="Write your blog content here..."
    />
  </Form.Group>

  {/* Image */}
  <Form.Group className="mb-4">
    <Form.Label className="fw-semibold text-dark">Upload Image</Form.Label>
    <Form.Control
      type="file"
      id="blog-image"
      className="rounded-3 shadow-sm"
      style={{ backgroundColor: '#f9f9f9', color: '#000' }}
      accept="image/*"
      onChange={(e) => setImageFile(e.target.files[0])}
      required
    />
  </Form.Group>

  {/* Submit */}
  <div className="d-flex justify-content-center">
    <Button
      type="submit"
      variant="success"
      disabled={status.loading}
      className="px-5 py-2 rounded-3 shadow-sm fw-semibold"
      style={{ minWidth: '160px', fontSize: '1rem' }}
    >
      <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
      {status.loading ? <Spinner animation="border" size="sm" /> : 'Publish Blog'}
    </Button>
  </div>

  {status.message && (
    <Alert className="mt-4 rounded-3 shadow-sm" variant={status.error ? 'danger' : 'success'}>
      {status.message}
    </Alert>
  )}
</Form>





        <div className="mt-5 py-4">
          <div className="text-center text-white mb-4">
            <h5 style={{ letterSpacing: '2px', color: '#aaa' }}>THE WILD TRAIL'S BLOG</h5>
            <h1>Discover the Untold Stories of Nature</h1>
          </div>

          <Row className="gx-4 gy-4">
            {blogs.map((blog) => (
              <Col xs={12} lg={6} key={blog.id}>
                <div className="p-4 shadow rounded bg-white h-100">
                  <Image src={blog.imageUrl} alt={blog.title} fluid className="rounded mb-3" />
                  <h3>{blog.title}</h3>
                  <p>{blog.description}</p>
                  <Button variant="secondary" size="sm" onClick={() => handleOpenModal(blog)}>
                    Edit or Delete
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      {/* Blog View/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{showEditForm ? 'Edit Blog' : 'Blog Details'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedBlog && !showEditForm && (
            <>
              <h5>{selectedBlog.title}</h5>
              <p>{selectedBlog.description}</p>
              <Image src={selectedBlog.imageUrl} fluid rounded className="mb-3" />
              <div className="d-flex justify-content-between">
                <Button variant="primary" onClick={() => setShowEditForm(true)}>Edit</Button>
                <Button variant="danger" onClick={confirmDelete}>Delete</Button>
              </div>
              {editStatus.message && (
                <Alert variant={editStatus.error ? 'danger' : 'success'} className="mt-3">
                  {editStatus.message}
                </Alert>
              )}
            </>
          )}

          {/* Edit Form */}
          {selectedBlog && showEditForm && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  style={{color : 'black',}}
                  value={selectedBlog.title}
                  onChange={(e) => setSelectedBlog({ ...selectedBlog, title: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                   style={{color : 'black',backgroundColor : 'white',}}
                  value={selectedBlog.description}
                  onChange={(e) => setSelectedBlog({ ...selectedBlog, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Image (optional)</Form.Label>
                <Form.Control  style={{color : 'black',}} type="file" onChange={(e) => setImageFile(e.target.files[0])} />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowEditForm(false)}>Cancel</Button>
                <Button variant="success" onClick={handleUpdate} disabled={editStatus.loading}>
                  {editStatus.loading ? <Spinner size="sm" animation="border" /> : 'Save Changes'}
                </Button>
              </div>
              {editStatus.message && (
                <Alert variant={editStatus.error ? 'danger' : 'success'} className="mt-3">
                  {editStatus.message}
                </Alert>
              )}
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedBlog?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminBlogAdd;
