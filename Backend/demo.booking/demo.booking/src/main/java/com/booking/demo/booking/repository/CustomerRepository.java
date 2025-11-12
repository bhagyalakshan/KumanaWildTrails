package com.booking.demo.booking.repository;



import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.booking.demo.booking.model.Customer;
import com.booking.demo.booking.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByUser(User user);

    boolean existsByUser(User user);
    @Query("SELECT c FROM Customer c WHERE c.user.email = :email")
    Optional<Customer> findByEmail(@Param("email") String email);
}