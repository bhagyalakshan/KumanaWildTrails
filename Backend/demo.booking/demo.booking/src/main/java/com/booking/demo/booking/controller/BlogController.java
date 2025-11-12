package com.booking.demo.booking.controller;

import com.booking.demo.booking.model.Blog;
import com.booking.demo.booking.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "http://localhost:5173")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        byte[] image = blogService.getBlogImage(id);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=image.jpg")
                .contentType(MediaType.IMAGE_JPEG)
                .body(image);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Blog> uploadBlog(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile imageFile) {

        try {
            Blog blog = new Blog();
            blog.setTitle(title);
            blog.setDescription(description);
            blog.setImage(imageFile.getBytes());

            Blog savedBlog = blogService.saveBlog(blog);
            return ResponseEntity.ok(savedBlog);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ Edit blog
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Blog> updateBlog(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        try {
            Blog existing = blogService.getBlogById(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            existing.setTitle(title);
            existing.setDescription(description);
            if (imageFile != null && !imageFile.isEmpty()) {
                existing.setImage(imageFile.getBytes());
            }

            Blog updated = blogService.saveBlog(existing);
            return ResponseEntity.ok(updated);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ✅ Delete blog
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        Blog existing = blogService.getBlogById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        blogService.deleteBlog(id);
        return ResponseEntity.ok().build();
    }
}
