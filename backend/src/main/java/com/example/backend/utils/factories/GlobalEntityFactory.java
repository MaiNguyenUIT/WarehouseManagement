package com.example.backend.utils.factories;

import com.example.backend.ENUM.ENTITY_TYPE;
import com.example.backend.model.BaseModel;
import com.example.backend.request.CategoryRequest;
import com.example.backend.request.ProductRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class GlobalEntityFactory {

    private static final GlobalEntityFactory INSTANCE = new GlobalEntityFactory();

    private final Map<ENTITY_TYPE, Function<Object, BaseModel>> creatorMap;

    private GlobalEntityFactory() {
        this.creatorMap = new HashMap<>();
        creatorMap.put(ENTITY_TYPE.CATEGORY, req -> {
            if (req instanceof CategoryRequest) {
                return CategoryCreator.getInstance().createCategoryFromRequest((CategoryRequest) req);
            }
            throw new IllegalArgumentException("Invalid request type for CATEGORY.");
        });
        creatorMap.put(ENTITY_TYPE.PRODUCT, req -> {
            if (req instanceof ProductRequest) {
                return ProductCreator.getInstance().createProductFromRequest((ProductRequest) req);
            }
            throw new IllegalArgumentException("Invalid request type for PRODUCT.");
        });
    }

    public static GlobalEntityFactory getInstance() {
        return INSTANCE;
    }

    public BaseModel createEntityFromRequest(Object requestObject, ENTITY_TYPE entityType) {
        Function<Object, BaseModel> creatorFunction = creatorMap.get(entityType);
        if (creatorFunction == null) {
            throw new IllegalArgumentException("Unsupported entity type: " + entityType);
        }
        return creatorFunction.apply(requestObject);
    }
}
