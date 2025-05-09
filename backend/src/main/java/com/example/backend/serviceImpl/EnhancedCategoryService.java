package com.example.backend.serviceImpl;

import com.example.backend.model.Category;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.request.CategoryRequest;
import com.example.backend.service.CategoryService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class EnhancedCategoryService implements CategoryService {
    private final CategoryRepository categoryRepository;

    public EnhancedCategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategory() {
        System.out.println("Fetching all categories with enhanced logging");
        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(CategoryRequest category) throws Exception {
        if (category.getCategoryName() == null || category.getCategoryName().trim().isEmpty()) {
            throw new Exception("Category name cannot be empty");
        }
        Optional<Category> existingCategory = categoryRepository.findBycategoryName(category.getCategoryName());
        if (existingCategory != null) {
            throw new Exception("Category is already exist");
        }
        Category newCategory = new Category();
        newCategory.setCategoryName(category.getCategoryName().trim());
        newCategory.setDescription(category.getDescription());
        System.out.println("Creating new category: " + category.getCategoryName());
        return categoryRepository.save(newCategory);
    }

    @Override
    public void deleteCategory(String categoryId) {
        System.out.println("Deleting category with ID: " + categoryId);
        categoryRepository.deleteById(categoryId);
    }

    @Override
    public List<String> getCategoryName() {
        List<Category> categories = categoryRepository.findAll();
        List<String> categoryName = new ArrayList<>();
        for (Category category : categories) {
            categoryName.add(category.getCategoryName());
        }
        System.out.println("Fetched category names: " + categoryName);
        return categoryName;
    }

    @Override
    public Optional<Category> getCategoryById(String id) {
        System.out.println("Fetching category with ID: " + id);
        return categoryRepository.findById(id);
    }
}