package com.booking.demo.booking.service;

import com.booking.demo.booking.model.Booking;
import com.booking.demo.booking.repository.BookingRepository;
import com.booking.demo.booking.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public List<Booking> getAllBooking() {
        return bookingRepository.findAll();
    }
    @Override
    public void rejectBooking(Long id, String reason) throws Exception {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new Exception("Booking not exists"));

        booking.setAssignedDriver(reason);
        booking.setStatus("rejected");
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);


        String subject = "🐾 KUMANA WILD TRAILS – Booking Rejected";
        String body = "Hello " + booking.getGuestName() + ",\n\n"
                + "Unfortunately, your booking for " + booking.getSafariPackageName()
                + " on " + booking.getSafariDate() + " was rejected.\n\n"
                + "Reason: " + reason + "\n\n"
                + "If you have any questions, feel free to contact us.\n\n"
                + "Rushan - +94 77 794 6022\n \t\t- +94 71 910 9308\n\n"
                + "Regards,\nKumana Wild Trails Team";

        emailService.sendBookingEmail(booking.getGuestEmail(), subject, body);
    }


    @Override
    public Booking createBooking(Booking booking) {
        if (booking.getStatus() == null || booking.getStatus().isEmpty()) {
            booking.setStatus("new");
        }

        Booking savedBooking = bookingRepository.save(booking);

        String generatedMessage = generatePackageMessage(savedBooking.getSafariPackageName(), savedBooking.getSafariPackageId());
        String subject = "🐾 KUMANA WILD TRAILS ALERT 📩 New (" + generatedMessage + ") " + savedBooking.getSafariPackageName() + " Booking Received";

        String body = "Hello Rushan,\n\nA new booking has been made:\n\n"
                + "Guest Name: " + savedBooking.getGuestName() + "\n"
                + "Guest Email: " + savedBooking.getGuestEmail() + "\n"
                + "Guest Phone: " + savedBooking.getGuestPhone() + "\n"
                + "Safari Date: " + savedBooking.getSafariDate() + "\n"
                + "Pickup Location: " + savedBooking.getPickupLocation() + "\n"
                + "Adults: " + savedBooking.getNumAdults() + "\n"
                + "Kids: " + savedBooking.getNumKids() + "\n"
                + "Special Requests: " + savedBooking.getSpecialRequests() + "\n"
                + "Total Amount: " + savedBooking.getTotalAmount() + "\n"
                + "Payment Status: " + savedBooking.getPaymentStatus() + "\n"
                + "Package: " + savedBooking.getSafariPackageName() + "\n";

        emailService.sendBookingEmail("bhagyalakshan1999@gmail.com", subject, body);

        return savedBooking;
    }

    @Override
    public void deleteBooking(Long id) throws Exception {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new Exception("Booking not exists"));
        bookingRepository.delete(booking);
    }

    @Override
    public void updateBookingStatus(Long id, String status) throws Exception {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new Exception("Booking not exists"));

        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);
    }

    @Override
    public void assignDriver(Long id, String driverName, String driverPhoneNumber) throws Exception {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new Exception("Booking not exists"));


        String assignedDriverInfo = driverName + " - " + driverPhoneNumber.trim();
        booking.setAssignedDriver(assignedDriverInfo);
        booking.setStatus("assigned");
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);


        String subject = "🐾 KUMANA WILD TRAILS ALERT – 🚗 Your Safari Driver Has Been Assigned!";
        String body = "Hello " + booking.getGuestName() + ",\n\n"
                + "We’re happy to let you know that a driver has been assigned for your package:\n\n"
                + "📅 Date: " + booking.getSafariDate() + "\n"
                + "📍 Pickup Location: " + booking.getPickupLocation() + "\n"
                + "🎒 Package: " + booking.getSafariPackageName() + "\n"
                + "🚗 Assigned Driver: " + booking.getAssignedDriver() + "\n\n"
                + "If you have any questions, feel free to reply to this email.\n\n"
                + "Thank you for booking with Kumana Wild Trails!";

        emailService.sendBookingEmail(booking.getGuestEmail(), subject, body);


    }
    @Override
    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByGuestEmail(email);
    }

    private String generatePackageMessage(String packageName, Long packageId) {
        if (packageName == null || packageId == null) {
            return "";
        }

        return switch (packageName) {
            case "Kumana National Park Safari Tour" -> switch (packageId.intValue()) {
                case 1 -> "Full Day";
                case 2 -> "Morning";
                case 3 -> "Evening";
                case 4 -> "Birdwatching";
                default -> "";
            };
            case "Surfing Lessons in Arugumbay" -> switch (packageId.intValue()) {
                case 1 -> "Arugumbay";
                case 2 -> "Peanut farm";
                case 3 -> "Panama";
                default -> "";
            };
            case "Airport Transport service" -> switch (packageId.intValue()) {
                case 1 -> "Car";
                case 2 -> "Van";
                default -> "";
            };
            default -> {
                if (packageName.startsWith("Tuk Tuk")) {
                    yield switch (packageId.intValue()) {
                        case 0 -> "Tuk Tuk Hire (Not a round trip)";
                        case 1 -> "Round trip Tuk Tuk Hire";
                        default -> "";
                    };
                } else {
                    yield switch (packageId.intValue()) {
                        case 1 -> "Bike Custom Tour";
                        case 2 -> "Tuk Tuk Custom Tour";
                        case 3 -> "Car Custom Tour";
                        case 4 -> "Van Custom Tour";
                        default -> "";
                    };
                }
            }
        };
    }
}
