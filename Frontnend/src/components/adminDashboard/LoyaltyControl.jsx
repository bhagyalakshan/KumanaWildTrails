import { useState, useEffect } from "react";
import { Label } from "@/components/ui/adminDashboard-ui/Label";
import { Form, Button, Card } from "react-bootstrap"; 
import { Toast } from "@/components/ui/adminDashboard-ui/toast";

const LoyaltyControl = () => {
  const [pointsPerDollar, setPointsPerDollar] = useState(1000); // Default: 1000 points = $1
  const [registrationPoints, setRegistrationPoints] = useState(100); // Default initial bonus
  const [loading, setLoading] = useState(true);

  // Fetch current loyalty settings from backend
  useEffect(() => {
    const fetchLoyaltySettings = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/customer/loyalty/settings"); // adjust if needed
        if (response.ok) {
          const data = await response.json();
          setPointsPerDollar(data.dollarRate || 1000);
          setRegistrationPoints(data.initial_point || 100);
        }
      } catch (err) {
        console.error("Error fetching loyalty settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoyaltySettings();
  }, []);

  const handleSaveChanges = async () => {
    if (pointsPerDollar <= 0 || registrationPoints < 0) {
      Toast({
        title: "Validation Error",
        description: "Please enter valid numeric values.",
      });
      return;
    }

    try {
      const payload = {
        initialPoint: registrationPoints,
        dollarRate: pointsPerDollar,
      };

      const response = await fetch("http://localhost:8080/api/customer/loyalty/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Toast({
          title: "Settings Saved",
          description: "Loyalty program settings updated successfully.",
        });
      } else {
        Toast({
          title: "Error",
          description: "Failed to update loyalty program settings.",
        });
      }
    } catch (err) {
      console.error("Error saving loyalty settings:", err);
      Toast({
        title: "Error",
        description: "An unexpected error occurred.",
      });
    }
  };

  if (loading) return <div>Loading loyalty settings...</div>;

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Card.Title as="h5" className="mb-0">
          Loyalty Program Controls
        </Card.Title>
        <Card.Text className="small text-muted">
          Configure how points convert to dollars and the initial registration bonus.
        </Card.Text>
      </Card.Header>
      <Card.Body>
        <div className="d-flex flex-column gap-4">
          {/* Point Conversion */}
          <div>
            <Label htmlFor="points-per-dollar" className="small fw-medium">
              Point Conversion Rate
            </Label>
            <div className="d-flex align-items-center gap-2 mt-1">
              <Form.Control
                id="points-per-dollar"
                type="number"
                value={pointsPerDollar}
                onChange={(e) => setPointsPerDollar(parseInt(e.target.value) || 0)}
                min="1"
                className="form-control form-control-sm w-150px"
              />
              <span className="text-muted">points = $1</span>
            </div>
            <p className="small text-muted mt-1">
              Example: {pointsPerDollar} points = $1
            </p>
          </div>

          {/* Registration Bonus Points */}
          <div>
            <Label htmlFor="registration-points" className="small fw-medium">
              Initial Registration Bonus Points
            </Label>
            <Form.Control
              id="registration-points"
              type="number"
              value={registrationPoints}
              onChange={(e) => setRegistrationPoints(parseInt(e.target.value) || 0)}
              min="0"
              className="form-control form-control-sm w-150px mt-1"
            />
          </div>

          {/* Save Button */}
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            className="mt-3"
          >
            Save Changes
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LoyaltyControl;
