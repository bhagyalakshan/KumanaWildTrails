import { useState } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Button, Badge } from "react-bootstrap";

// Mock Review Data (no TS types)
const MOCK_REVIEWS = [
  {
    id: "r1",
    customerName: "Sarah Johnson",
    rating: 5,
    date: "May 24, 2025",
    comment:
      "Amazing experience! Our guide was knowledgeable and we saw so many elephants and birds. Will definitely recommend to friends.",
    verified: true,
    driverName: "Kumar Perera",
  },
  {
    id: "r2",
    customerName: "Michael Brown",
    rating: 4,
    date: "May 23, 2025",
    comment:
      "Great safari, though it was very hot. The driver was excellent and made sure we saw lots of wildlife.",
    verified: true,
    driverName: "Ajith Fernando",
  },
  {
    id: "r3",
    customerName: "Emma Wilson",
    rating: 3,
    date: "May 22, 2025",
    comment:
      "Decent experience but the vehicle was uncomfortable. We did see a leopard which was amazing!",
    verified: false,
    driverName: "Malik Jayasuriya",
  },
  {
    id: "r4",
    customerName: "David Lee",
    rating: 5,
    date: "May 21, 2025",
    comment:
      "Incredible safari! We saw a bear, elephants, and many birds. Our guide was extremely knowledgeable.",
    verified: true,
    driverName: "Saman Rathnayake",
  },
  {
    id: "r5",
    customerName: "Jennifer Chen",
    rating: 2,
    date: "May 20, 2025",
    comment:
      "Disappointing. Too crowded and we barely saw any animals. The driver was nice but seemed in a rush.",
    verified: true,
    driverName: "Nuwan Silva",
  },
];

// Star Rating Subcomponent
const StarRating = ({ rating }) => {
  return (
    <div className="d-flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`me-1 ${i < rating ? "text-warning" : "text-muted"}`}
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Reviews Table Component (plain JS)
const ReviewsTable = () => {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");

  const startEditing = (review) => {
    setEditingId(review.id);
    setEditComment(review.comment);
  };

  const saveEdit = (id) => {
    console.log(`Saving edited review ${id} with comment: ${editComment}`);
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, comment: editComment } : review
      )
    );
    setEditingId(null);
  };

  const deleteReview = (id) => {
    console.log(`Deleting review ${id}`);
    setReviews(reviews.filter((review) => review.id !== id));
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="card-title mb-0">Customer Reviews & Ratings</h5>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr className="text-muted small">
              <th scope="col" className="p-3">Customer</th>
              <th scope="col" className="p-3">Rating</th>
              <th scope="col" className="p-3">Date</th>
              <th scope="col" className="p-3">Comment</th>
              <th scope="col" className="p-3">Driver</th>
              <th scope="col" className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="small">
                <td className="p-3">
                  <div className="d-flex align-items-center">
                    <span className="fw-medium">{review.customerName}</span>
                    {review.verified && (
                      <Badge bg="success" className="ms-2 small">
                        Verified
                      </Badge>
                    )}
                  </div>
                </td>
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
                      onClick={() => deleteReview(review.id)}
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
    </div>
  );
};

export default ReviewsTable;