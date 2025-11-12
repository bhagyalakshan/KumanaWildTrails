package com.booking.demo.booking.repository;


import com.booking.demo.booking.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<Blog, Long> {
}