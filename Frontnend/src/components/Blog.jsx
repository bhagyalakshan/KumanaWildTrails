import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Modal, Button } from "react-bootstrap";
import axios from "axios";
import "./Blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/api/blogs").then((res) => {
      const updated = res.data.map((blog) => ({
        ...blog,
        imageUrl: `http://localhost:8080/api/blogs/image/${blog.id}`,
      }));
      const sorted = updated.sort((a, b) => b.id - a.id);
      setBlogs(sorted);
    });

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  const iconColor = "#2d6a4f";
   const iconC = "#ebe30dff";
  const headerColor = "#1b4332";

  const leftBigBlogs = blogs.slice(0, 2);
  const rightSmallBlogs = blogs.slice(2);

  return (
    <Container
      className="py-2"
      style={{
        fontFamily: "Comic Sans MS, cursive, sans-serif",
        marginTop: "50px",
        marginBottom:'50px',
      }}
    >
      <div
        className="text-center zoom-in-text"
        style={{ color: iconColor, marginBottom: "40px" }}
      >
        <h5
          style={{
            letterSpacing: "2px",
            color: "#888",
            fontSize: isMobile ? "1rem" : "1rem",
          }}
        >
          THE WILD TRAIL'S BLOG
        </h5>
        <h1
          style={{
            fontSize: isMobile ? "2rem" : "2.6rem",
            fontWeight: "700",
          }}
        >
          Discover the Untold Stories of Nature
        </h1>
      </div>

      {blogs.length > 0 && (
        <Row className="gx-4 gy-4 align-items-start">
          <Col xs={12} lg={8} className="d-flex flex-column gap-4">
            {leftBigBlogs.map((blog) => (
              <div
                key={blog.id}
                className="blog-card zoom-in-hover p-4 shadow bg-white"
                onClick={() => openModal(blog)}
                style={{
                  cursor: "pointer",
                  borderRadius: "24px",
                  backgroundColor: "#fff",
                  flex: "none",
                }}
              >
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  fluid
                  style={{
                    height: "400px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  className="rounded mb-3"
                />
                <h3 className="fw-bold mb-3" style={{ color: headerColor }}>
                  {blog.title}
                </h3>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.7", marginBottom: 0 }}>
                  {blog.description.length > 200
                    ? blog.description.substring(0, 200) + "... "
                    : blog.description}{" "}
                  <span style={{ color: iconC }}>Read more</span>
                </p>
              </div>
            ))}
          </Col>

          <Col xs={12} lg={4} className="d-flex flex-column gap-4">
            {rightSmallBlogs.map((blog) => (
              <div
                key={blog.id}
                className="blog-card zoom-in-hover p-3 shadow bg-white"
                onClick={() => openModal(blog)}
                style={{
                  cursor: "pointer",
                  borderRadius: "24px",
                  backgroundColor: "#fff",
                }}
              >
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  fluid
                  style={{
                    height: "180px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  className="rounded mb-2"
                />
                <h5 className="fw-bold mb-2" style={{ color: headerColor }}>
                  {blog.title}
                </h5>
                <p style={{ fontSize: "1rem", marginBottom: 0 }}>
                  {blog.description.substring(0, 80)}...{" "}
                  <span style={{ color: iconC }}>Read more</span>
                </p>
              </div>
            ))}
          </Col>
        </Row>
      )}

      <Modal
  show={showModal}
  onHide={closeModal}
  size="lg"
  centered
  style={{ color: "#000" }} // sets all text inside modal to black
>
  {selectedBlog && (
    <>
      <Modal.Body
        style={{
          padding: "30px",
          backgroundColor: "#fff", // white background
          color: "#000",           // black text
        }}
      >
        <Image
          src={selectedBlog.imageUrl}
          alt={selectedBlog.title}
          fluid
          className="rounded mb-4"
        />
        <h3 className="fw-bold mb-3" style={{ color: "#000" }}>
          {selectedBlog.title}
        </h3>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#000" }}>
          {selectedBlog.description}
        </p>
      </Modal.Body>
      <Modal.Footer
        style={{
          borderTop: "none",
          backgroundColor: "#fff", // footer also white
          color: "#000",
        }}
      >
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </>
  )}
</Modal>

    </Container>
  );
};

export default Blog;
