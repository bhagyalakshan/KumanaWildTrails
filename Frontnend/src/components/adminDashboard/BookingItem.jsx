import { useState } from "react";
import { AlertCircleIcon, CheckCircleIcon, ClockIcon, UserIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/home-ui/Button";
import { Badge } from "@/components/ui/home-ui/Badge";
import { Progress } from "@/components/ui/home-ui/Progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/home-ui/Dialog";
import { Textarea } from "@/components/ui/home-ui/Textarea";

// Mapping badge by status (JS only, removed BookingStatus type)
const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-warning-subtle text-warning border-warning">Pending</Badge>;
    case "assigned":
      return <Badge variant="outline" className="bg-primary-subtle text-primary border-primary">Driver Assigned</Badge>;
    case "driver_accepted":
      return <Badge variant="outline" className="bg-info-subtle text-info border-info">Driver Accepted</Badge>;
    case "confirmed":
      return <Badge variant="outline" className="bg-success-subtle text-success border-success">Confirmed</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="bg-danger-subtle text-danger border-danger">Cancelled</Badge>;
    case "no_driver":
      return <Badge variant="outline" className="bg-warning-subtle text-warning border-warning">No Driver Available</Badge>;
    case "external_driver":
      return <Badge variant="outline" className="bg-secondary-subtle text-secondary border-secondary">External Driver</Badge>;
    default:
      return null;
  }
};

const getStatusProgress = (status) => {
  switch (status) {
    case "pending": return 25;
    case "assigned": return 50;
    case "driver_accepted": return 75;
    case "no_driver": return 50;
    case "external_driver": return 75;
    case "confirmed": return 100;
    case "cancelled": return 100;
    default: return 0;
  }
};

const BookingItem = ({
  id,
  customerName,
  date,
  time,
  persons,
  status,
  package: packageName,
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [expanded, setExpanded] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [driverResponseDialog, setDriverResponseDialog] = useState(false);

  const assignDriver = () => {
    console.log("Assigning driver to booking", id);
    setCurrentStatus("assigned");
    setTimeout(() => {
      setDriverResponseDialog(true);
    }, 3000);
  };

  const handleDriverResponse = (accepted) => {
    if (accepted) {
      console.log("Driver accepted booking", id);
      setCurrentStatus("driver_accepted");
    } else {
      console.log("Driver rejected booking", id);
      setDriverResponseDialog(false);
    }
  };

  const useExternalDriver = () => {
    console.log("Using external driver for booking", id);
    setCurrentStatus("external_driver");
  };

  const noDriverAvailable = () => {
    console.log("No driver available for booking", id);
    setCurrentStatus("no_driver");
  };

  const confirmBooking = () => {
    console.log("Confirming booking", id);
    setCurrentStatus("confirmed");
  };

  const cancelBooking = () => {
    if (cancelReason.trim() === "") return;
    console.log("Cancelling booking", id, "Reason:", cancelReason);
    setCurrentStatus("cancelled");
    setCancelDialogOpen(false);
  };

  return (
    <div className="card border mb-3">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2">
          <div>
            <div className="d-flex align-items-center">
              <h3 className="fw-semibold mb-0">{customerName}</h3>
              <span className="mx-2 text-muted">•</span>
              <span className="small text-muted">Booking #{id}</span>
            </div>
            <div className="d-flex align-items-center mt-1 small text-muted">
              <ClockIcon className="me-1" size={14} />
              {date}, {time} • {persons} {persons === 1 ? "Person" : "Persons"} • {packageName}
            </div>
          </div>
          <div className="d-flex align-items-center">
            {getStatusBadge(currentStatus)}
            <Button variant="link" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Hide" : "Details"}
            </Button>
          </div>
        </div>

        {currentStatus !== "cancelled" && currentStatus !== "confirmed" && (
          <div className="mt-3">
            <div className="d-flex justify-content-between small text-muted mb-1">
              <span>Pending</span>
              <span className="text-center">Driver</span>
              <span className="text-end">Confirmed</span>
            </div>
            <Progress value={getStatusProgress(currentStatus)} className="h-100px" />
          </div>
        )}

        {expanded && (
          <div className="mt-4 pt-3 border-top">
            <div className="row row-cols-1 row-cols-md-2 g-4">
              <div>
                <h4 className="small fw-medium text-muted">Customer Details</h4>
                <div className="mt-2 d-flex flex-column gap-1 small">
                  <p className="mb-0"><span className="text-muted">Name:</span> {customerName}</p>
                  <p className="mb-0"><span className="text-muted">Phone:</span> +94 75 123 4567</p>
                  <p className="mb-0"><span className="text-muted">Email:</span> customer@example.com</p>
                </div>
              </div>
              <div>
                <h4 className="small fw-medium text-muted">Safari Details</h4>
                <div className="mt-2 d-flex flex-column gap-1 small">
                  <p className="mb-0"><span className="text-muted">Date:</span> {date}</p>
                  <p className="mb-0"><span className="text-muted">Time:</span> {time}</p>
                  <p className="mb-0"><span className="text-muted">Duration:</span> 3 hours</p>
                  <p className="mb-0"><span className="text-muted">Type:</span> {packageName}</p>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              {currentStatus === "pending" && (
                <Button size="sm" className="btn-primary" onClick={assignDriver}>
                  Assign Driver
                </Button>
              )}
              {currentStatus === "assigned" && (
                <Button size="sm" variant="outline-warning" onClick={() => setDriverResponseDialog(true)}>
                  Check Driver Response
                </Button>
              )}
              {currentStatus === "no_driver" && (
                <div className="d-flex gap-2 w-100">
                  <Button size="sm" className="btn-primary" onClick={useExternalDriver}>
                    <UserIcon className="me-1" size={16} />
                    Use External Driver
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => setCancelDialogOpen(true)}>
                    <XCircleIcon className="me-1" size={16} />
                    Cancel Safari
                  </Button>
                </div>
              )}
              {(currentStatus === "driver_accepted" || currentStatus === "external_driver") && (
                <Button size="sm" className="btn-primary" onClick={confirmBooking}>
                  Confirm Booking
                </Button>
              )}
              {currentStatus !== "cancelled" && currentStatus !== "confirmed" && (
                <Button size="sm" variant="outline-danger" onClick={() => setCancelDialogOpen(true)}>
                  <XCircleIcon className="me-1" size={16} />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Driver Response Dialog */}
      <Dialog open={driverResponseDialog} onOpenChange={setDriverResponseDialog}>
        <DialogContent className="w-md">
          <DialogHeader>
            <DialogTitle>Driver Response</DialogTitle>
            <DialogDescription>The assigned driver has responded to the booking request.</DialogDescription>
          </DialogHeader>
          <div className="py-4 d-flex flex-column gap-2 small text-muted">
            <p className="mb-0"><strong>Driver:</strong> John Doe</p>
            <p className="mb-0"><strong>Vehicle:</strong> Safari Jeep #128</p>
            <p className="mb-0"><strong>Status:</strong> <span className="text-danger">Unavailable for this booking</span></p>
            <p className="mb-0"><strong>Reason:</strong> Vehicle under maintenance</p>
          </div>
          <DialogFooter className="d-flex flex-column flex-sm-row justify-content-between gap-2">
            <Button type="button" variant="outline-primary" onClick={() => { setDriverResponseDialog(false); useExternalDriver(); }}>
              Use External Driver
            </Button>
            <Button type="button" variant="outline-danger" onClick={() => { setDriverResponseDialog(false); noDriverAvailable(); }}>
              No Driver Available
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="w-md">
          <DialogHeader>
            <DialogTitle>Cancel Safari Booking</DialogTitle>
            <DialogDescription>Please provide a reason for cancellation.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="h-100px"
            />
          </div>
          <DialogFooter className="d-flex justify-content-between">
            <Button type="button" variant="outline-secondary" onClick={() => setCancelDialogOpen(false)}>
              Go Back
            </Button>
            <Button type="button" variant="danger" onClick={cancelBooking} disabled={cancelReason.trim() === ""}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingItem;