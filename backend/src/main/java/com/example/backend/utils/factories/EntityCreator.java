package com.example.backend.utils.factories;

import java.time.LocalDateTime;

import com.example.backend.model.BaseModel;

public abstract class EntityCreator {
    protected abstract BaseModel createSpecificEntityInstance();
    public BaseModel createAndPrepareEntity() {
        BaseModel newEntity = createSpecificEntityInstance();

        newEntity.setCreatedAt(LocalDateTime.now());
        newEntity.setUpdatedAt(LocalDateTime.now());

        return newEntity;
    }
}