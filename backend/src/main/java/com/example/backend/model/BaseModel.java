package com.example.backend.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BaseModel {
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
