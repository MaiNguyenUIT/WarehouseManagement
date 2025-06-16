package com.example.backend.utils.factories;

import java.time.LocalDateTime;

import com.example.backend.model.BaseModel;
import com.example.backend.model.Category;
import com.example.backend.request.CategoryRequest;

public class CategoryFactoryManage implements EntityFactory {
    private CategoryFactoryManage() {}

    private static class SingletonHelper {
        private static final CategoryFactoryManage INSTANCE = new CategoryFactoryManage();
    }

    public static CategoryFactoryManage getInstance() {
        return SingletonHelper.INSTANCE;
    }

    @Override
    public BaseModel createEntity() {
 
        Category newCategory = new Category();
        newCategory.setCreatedAt(LocalDateTime.now());
        newCategory.setUpdatedAt(LocalDateTime.now());
        return newCategory;
    }

    public Category createCategoryFromRequest(CategoryRequest categoryRequest) {
        Category newCategory = new Category();
        newCategory.setCategoryName(categoryRequest.getCategoryName());
        newCategory.setDescription(categoryRequest.getDescription());
        newCategory.setCreatedAt(LocalDateTime.now());
        newCategory.setUpdatedAt(LocalDateTime.now());
        return newCategory;
    }


}