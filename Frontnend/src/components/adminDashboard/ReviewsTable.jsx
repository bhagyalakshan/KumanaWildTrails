import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Modal } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

const token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const StarRating = ({ rating }) => (
  <div className="d-flex">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`me-1 ${i < rating ? "text-warning" : "text-muted"}`}
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ReviewsTable = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/reviews/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        toast.error("Failed to load reviews");
        setReviews([]);
      }
    };

    fetchReviews();
  }, []);

  const sortedReviews = [...reviews].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    } else if (sortField === "driverName" || sortField === "customerName") {
      valA = valA?.toLowerCase() || "";
      valB = valB?.toLowerCase() || "";
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const startEditing = (review) => {
    setEditingId(review.id);
    setEditComment(review.comment);
  };

  const saveEdit = (id) => {
    fetch(`${BASE_URL}/api/reviews/edit/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: editComment }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setReviews(
          reviews.map((r) => (r.id === id ? { ...r, comment: editComment } : r))
        );
        setEditingId(null);
        toast.success("Comment updated successfully");
      })
      .catch(() => toast.error("Failed to update comment"));
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const deleteReview = (id) => {
    fetch(`${BASE_URL}/api/reviews/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setReviews(reviews.filter((r) => r.id !== id));
        setConfirmDeleteId(null);
        toast.success("Review deleted");
      })
      .catch(() => toast.error("Failed to delete review"));
  };

  return (
    <div className="position-relative">
      <Toaster position="top-right" />
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="card-title mb-0">Customer Reviews & Ratings</h5>
        </div>

        <div className="table-responsive">
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <table className="table table-bordered">
              <thead className="sticky-top bg-white">
                <tr className="small text-muted">
                  <th
                    scope="col"
                    className="p-3 cursor-pointer"
                    style={{ width: "15%" }}
                    onClick={() => handleSort("customerName")}
                  >
                    <div className="d-flex align-items-center gap-1">
                      Customer
                      {sortField === "customerName" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ChevronsUpDown size={12} className="opacity-50" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="p-3 cursor-pointer"
                    style={{ width: "10%" }}
                    onClick={() => handleSort("rating")}
                  >
                    <div className="d-flex align-items-center gap-1">
                      Rating
                      {sortField === "rating" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ChevronsUpDown size={12} className="opacity-50" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="p-3 cursor-pointer"
                    style={{ width: "15%" }}
                    onClick={() => handleSort("date")}
                  >
                    <div className="d-flex align-items-center gap-1">
                      Date
                      {sortField === "date" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ChevronsUpDown size={12} className="opacity-50" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="p-3" style={{ width: "30%" }}>
                    Comment
                  </th>
                  <th
                    scope="col"
                    className="p-3 cursor-pointer"
                    style={{ width: "15%" }}
                    onClick={() => handleSort("driverName")}
                  >
                    <div className="d-flex align-items-center gap-1">
                      Driver
                      {sortField === "driverName" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ChevronsUpDown size={12} className="opacity-50" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="p-3" style={{ width: "15%" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((review) => (
                  <tr key={review.id} className="small">
                    <td className="p-3 fw-medium">{review.customerName}</td>
                    <td className="p-3">
                      <StarRating rating={review.rating} />
                    </td>
                    <td className="p-3 text-muted">{review.date}</td>
                    <td className="p-3" style={{ maxWidth: "200px" }}>
                      {editingId === review.id ? (
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="form-control form-control-sm"
                          rows={2}
                        />
                      ) : (
                        <p className="text-truncate mb-0">{review.comment}</p>
                      )}
                    </td>
                    <td className="p-3 text-muted">{review.driverName}</td>
                    <td className="p-3">
                      <div className="d-flex gap-2">
                        {editingId === review.id ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => saveEdit(review.id)}
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => startEditing(review)}
                          >
                            <PencilIcon size={16} />
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => confirmDelete(review.id)}
                        >
                          <TrashIcon size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex align-items-center justify-content-between p-3 border-top">
            <div className="small text-muted">
              Showing {indexOfFirstReview + 1}-{Math.min(indexOfLastReview, sortedReviews.length)} of {sortedReviews.length} reviews
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <div className="d-flex align-items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2">...</span>
                )}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal show={!!confirmDeleteId} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this review?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteReview(confirmDeleteId)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewsTable;