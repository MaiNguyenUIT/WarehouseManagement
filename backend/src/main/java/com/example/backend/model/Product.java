package com.example.backend.model;

import com.example.backend.ENUM.PRODUCT_STATUS;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document(
        "products"
)
public class Product extends BaseModel {
    @Id
    private String id;
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
    private PRODUCT_STATUS productStatus = PRODUCT_STATUS.IN_STOCK;

    @Override
    public void initializeDefaultsAndValidate() {
        if (this.inventory_quantity < 0) {
            this.inventory_quantity = 0;
            System.out.println("WARNING: Product inventory quantity was negative, set to 0.");
        }
        if (this.productStatus == null) {
            this.productStatus = PRODUCT_STATUS.IN_STOCK;
        }
        if (this.price < 0) {
            this.price = 0;
            System.out.println("WARNING: Product price was negative, set to 0.");
        }
        System.out.println("DEBUG: Product '" + this.productName + "' initialized and validated.");
    }

    public static class ProductBuilder {
        private Product product = new Product();

        public ProductBuilder withProductName(String productName) {
            this.product.setProductName(productName);
            return this;
        }

        public ProductBuilder withProductionDate(Date production_date) {
            this.product.setProduction_date(production_date);
            return this;
        }

        public ProductBuilder withUnit(String unit) {
            this.product.setUnit(unit);
            return this;
        }

        public ProductBuilder withSupplierId(String supplierId) {
            this.product.setSupplierId(supplierId);
            return this;
        }

        public ProductBuilder withCategoryId(String categoryId) {
            this.product.setCategoryId(categoryId);
            return this;
        }

        public ProductBuilder withExpirationDate(Date expiration_date) {
            this.product.setExpiration_date(expiration_date);
            return this;
        }

        public ProductBuilder withImage(String image) {
            this.product.setImage(image);
            return this;
        }

        public ProductBuilder withDescription(String description) {
            this.product.setDescription(description);
            return this;
        }

        public ProductBuilder withInventoryQuantity(Integer inventory_quantity) {
            this.product.setInventory_quantity(inventory_quantity != null ? inventory_quantity : 0);
            return this;
        }

        public ProductBuilder withPrice(Integer price) {
            this.product.setPrice(price != null ? price : 0);
            return this;
        }

        public ProductBuilder withCreatedAt(LocalDateTime createdAt) {
            this.product.setCreatedAt(createdAt);
            return this;
        }

        public ProductBuilder withUpdatedAt(LocalDateTime updatedAt) {
            this.product.setUpdatedAt(updatedAt);
            return this;
        }

        public Product build() {

            if (this.product.getCreatedAt() == null) {
                this.product.setCreatedAt(LocalDateTime.now());
            }
            if (this.product.getUpdatedAt() == null) {
                this.product.setUpdatedAt(LocalDateTime.now());
            }

            this.product.initializeDefaultsAndValidate();

            return this.product;
        }
    }
}
