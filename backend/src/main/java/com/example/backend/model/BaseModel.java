package com.example.backend.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public abstract class BaseModel {
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public abstract void initializeDefaultsAndValidate();
}
