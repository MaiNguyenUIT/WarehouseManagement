package com.example.backend.utils.factories;

import java.time.LocalDateTime;

import org.w3c.dom.Entity;

import com.example.backend.model.BaseModel;
import com.example.backend.model.Category;
import com.example.backend.request.CategoryRequest;

public class CategoryCreator extends EntityCreator {
    private CategoryCreator() {}

    private static class SingletonHelper {
        private static final CategoryCreator INSTANCE = new CategoryCreator();
    }

    public static CategoryCreator getInstance() {
        return SingletonHelper.INSTANCE;
    }

    @Override
    protected BaseModel createSpecificEntityInstance() {
        return new Category();
    }


    public Category createCategoryFromRequest(CategoryRequest categoryRequest) {
        Category newCategory = (Category) createAndPrepareEntity();

        newCategory.setCategoryName(categoryRequest.getCategoryName());
        newCategory.setDescription(categoryRequest.getDescription());

        newCategory.initializeDefaultsAndValidate();

        return newCategory;
    }


}