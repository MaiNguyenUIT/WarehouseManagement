package com.example.backend.config.Category;

import com.example.backend.config.CategoryServiceFactory;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.service.CategoryService;
import com.example.backend.serviceImpl.EnhancedCategoryService;

public class EnhancedCategoryServiceFactory implements CategoryServiceFactory {
    private final CategoryRepository categoryRepository;

    public EnhancedCategoryServiceFactory(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryService createCategoryService() {
        return new EnhancedCategoryService(categoryRepository);
    }
}
