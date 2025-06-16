package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(
        "categories"
)
public class Category extends BaseModel {
    @Id
    private String id;
    private String categoryName;
    private String description;
}
