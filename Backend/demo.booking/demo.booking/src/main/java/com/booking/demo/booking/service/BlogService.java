package com.booking.demo.booking.service;

import com.booking.demo.booking.model.Blog;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BlogService {
    Blog saveBlog(Blog blog);
    List<Blog> getAllBlogs();
    byte[] getBlogImage(Long id);
    Blog getBlogById(Long id);
    void deleteBlog(Long id);
}
