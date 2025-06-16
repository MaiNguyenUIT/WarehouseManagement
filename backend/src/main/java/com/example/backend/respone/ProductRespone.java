package com.example.backend.respone;


import com.example.backend.ENUM.PRODUCT_STATUS;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;


@Data
public class ProductRespone{
    private String id;
    private String productName;
    private int inventory_quantity;
    private String supplierId;
    private String categoryId;
    private String unit;
    private String description;
    private String image;
    private Date production_date;
    private Date expiration_date;
    private int price;

    private String supplierName;
    private String categoryName;
    private PRODUCT_STATUS productStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

