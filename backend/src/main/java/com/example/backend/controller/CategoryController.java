package com.example.backend.controller;

import com.example.backend.model.Category;
import com.example.backend.model.User;
import com.example.backend.pattern.BuilderPattern.CategoryApiResponse;
import com.example.backend.request.CategoryRequest;
import com.example.backend.service.CategoryService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<CategoryApiResponse> getAllCategory(@RequestHeader("Authorization") String jwt)
            throws Exception {
        CategoryApiResponse response = new CategoryApiResponse.Builder()
                .setData(categoryService.getAllCategory())
                .setCode(200)
                .setMessage("Get all category successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getCategoryName")
    public ResponseEntity<CategoryApiResponse> getAllCategoryName(@RequestHeader("Authorization") String jwt)
            throws Exception {
        CategoryApiResponse response = new CategoryApiResponse.Builder()
                .setData(categoryService.getCategoryName())
                .setCode(200)
                .setMessage("Get all category name successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryApiResponse> getCategoryById(@RequestHeader("Authorization") String jwt,
            @PathVariable String id) throws Exception {
        CategoryApiResponse response = new CategoryApiResponse.Builder()
                .setData(categoryService.getCategoryById(id))
                .setCode(200)
                .setMessage("Get all category successfully")
                .build();
        return ResponseEntity.ok(response);
    }
}
