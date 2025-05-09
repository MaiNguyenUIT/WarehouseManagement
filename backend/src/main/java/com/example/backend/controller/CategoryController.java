package com.example.backend.controller;

import com.example.backend.model.Category;
import com.example.backend.model.User;
import com.example.backend.pattern.BuilderPattern.ApiResponse;
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
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategory(@RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        ApiResponse<List<Category>> response = new ApiResponse.Builder<List<Category>>()
                .data(categoryService.getAllCategory())
                .status(200)
                .message("Get all category successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getCategoryName")
    public ResponseEntity<List<String>> getAllCategoryName(@RequestHeader("Authorization") String jwt)
            throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        ApiResponse<List<String>> response = new ApiResponse.Builder<List<String>>()
                .data(categoryService.getCategoryName())
                .status(200)
                .message("Get all category name successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Category>> getCategoryById(@RequestHeader("Authorization") String jwt,
            @PathVariable String id) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        ApiResponse<Optional<Category>> response = new ApiResponse.Builder<Optional<Category>>()
                .data(categoryService.getCategoryById(id))
                .status(200)
                .message("Get all category successfully")
                .build();
        return ResponseEntity.ok(response);
    }
}
