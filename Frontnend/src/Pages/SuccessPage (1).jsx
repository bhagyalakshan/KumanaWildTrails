import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SuccessPage.css';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="success-page-wrapper">
      <div className="success-container">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-12 text-center mb-3">
              <h1 className="display-5 text-black fw-bold">Kumana WildTrails Safari</h1>
              <p className="lead text-black">Your gateway to nature's wonders</p>
            </div>
            
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              {/* Success Card */}
              <div className="card success-main-card shadow-lg">
                <div className="card-body p-4 p-md-4 text-center">
                  <div className="success-icon-wrapper mb-3">
                    <div className="success-icon-animation">
                      <div className="success-icon bg-success rounded-circle d-inline-flex align-items-center justify-content-center">
                        <svg viewBox="0 0 100 100" width="60" height="60">
                          <path d="M20,50 L40,70 L80,30" stroke="white" strokeWidth="10" fill="none" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="card-title text-success mb-2 fw-bold">Payment Successful!</h2>
                  <p className="card-text mb-3">
                    Thank you for choosing Kumana WildTrails Safari Adventures. 
                    Your payment has been successfully processed and your safari experience is confirmed!
                  </p>
                  
                  <div className="confetti confetti-1"></div>
                  <div className="confetti confetti-2"></div>
                  <div className="confetti confetti-3"></div>
                </div>
              </div>
              
              {/* Important Notes Card */}
              <div className="card notes-card shadow-lg mt-3">
                <div className="card-body p-3">
                  <h3 className="card-title h5 text-center mb-2">
                    <i className="fas fa-info-circle me-2 text-success"></i>
                    Important Notes
                  </h3>
                  
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex align-items-center py-2">
                      <span className="note-icon me-2">⏰</span>
                      <div className="note-text">Please arrive 30 minutes before your scheduled safari time</div>
                    </li>
                    <li className="list-group-item d-flex align-items-center py-2">
                      <span className="note-icon me-2">🧭</span>
                      <div className="note-text">Your guide will meet you at the main entrance</div>
                    </li>
                  </ul>

                  <div className="d-grid gap-2 mt-3">
                    <button className="btn btn-success btn-lg home-button" onClick={handleGoHome}>
                      <span className="me-2">🏠</span>
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;