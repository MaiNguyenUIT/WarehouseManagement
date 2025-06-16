package com.example.backend.request;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
@Data
public class ProductRequest {
    @Field("category_id")
    private String categoryId;
    @Field("supplier_id")
    private String supplierId;
    private String productName;
    private int inventory_quantity;
    private String unit;
    private String description;
    private String image;
    private Date production_date;
    private Date expiration_date;
    private int price;
}
