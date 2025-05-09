package com.example.backend.config;

import com.example.backend.service.CategoryService;

public interface CategoryServiceFactory {
    CategoryService createCategoryService();
}
