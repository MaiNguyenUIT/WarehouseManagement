package com.example.backend.serviceImpl;

import com.example.backend.model.Category;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.request.CategoryRequest;
import com.example.backend.service.CategoryService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class StandardCategoryService implements CategoryService {
    private final CategoryRepository categoryRepository;

    public StandardCategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(CategoryRequest category) throws Exception {
        Optional<Category> existingCategory = categoryRepository.findBycategoryName(category.getCategoryName());

        if (existingCategory != null) {
            throw new Exception("Category is already exist");
        }
        Category newCategory = new Category();
        newCategory.setCategoryName(category.getCategoryName());
        newCategory.setDescription(category.getDescription());
        return categoryRepository.save(newCategory);
    }

    @Override
    public void deleteCategory(String categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    @Override
    public List<String> getCategoryName() {
        List<Category> categories = categoryRepository.findAll();
        List<String> categoryName = new ArrayList<>();
        for (Category category : categories) {
            categoryName.add(category.getCategoryName());
        }
        return categoryName;
    }

    @Override
    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }
}