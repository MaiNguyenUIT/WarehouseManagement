package com.example.backend.service;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import com.example.backend.model.Category;
import com.example.backend.request.CategoryRequest;

import java.util.List;
import java.util.Optional;

// Singleton Pattern cho CategoryServiceManager
@Component
@Scope("singleton")
public class CategoryServiceManager implements CategoryService {
    private static volatile CategoryServiceManager instance;
    private final CategoryService delegate;

    private CategoryServiceManager(CategoryService delegate) {
        this.delegate = delegate;
    }

    public static CategoryServiceManager getInstance(CategoryService delegate) {
        if (instance == null) {
            synchronized (CategoryServiceManager.class) {
                if (instance == null) {
                    instance = new CategoryServiceManager(delegate);
                }
            }
        }
        return instance;
    }

    @Override
    public List<Category> getAllCategory() {
        return delegate.getAllCategory();
    }

    @Override
    public Category createCategory(CategoryRequest categoryRequest) throws Exception {
        return delegate.createCategory(categoryRequest);
    }

    @Override
    public void deleteCategory(String categoryId) {
        delegate.deleteCategory(categoryId);
    }

    @Override
    public List<String> getCategoryName() {
        return delegate.getCategoryName();
    }

    @Override
    public Optional<Category> getCategoryById(String id) {
        return delegate.getCategoryById(id);
    }
}