package com.example.backend.config;

import com.example.backend.service.CategoryService;
import com.example.backend.service.CategoryServiceManager;
import com.example.backend.config.Category.EnhancedCategoryServiceFactory;
import com.example.backend.config.Category.StandardCategoryServiceFactory;
import com.example.backend.repository.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class CategoryServiceConfig {
    @Autowired
    private Environment env;

    @Bean
    public CategoryServiceFactory categoryServiceFactory(CategoryRepository categoryRepository) {
        // Có thể sử dụng biến môi trường hoặc cấu hình để chọn factory
        String profile = env.getProperty("spring.profiles.active");
        if ("enhanced".equalsIgnoreCase(profile)) {
            return new EnhancedCategoryServiceFactory(categoryRepository);
        }
        return new StandardCategoryServiceFactory(categoryRepository);
    }

    @Bean
    public CategoryService categoryService(CategoryServiceFactory categoryServiceFactory) {

        return CategoryServiceManager.getInstance(categoryServiceFactory.createCategoryService());
    }
}