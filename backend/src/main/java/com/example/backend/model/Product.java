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

    public static class ProductBuilder {
        private String productName;
        private Date production_date;
        private String unit;
        private String supplierId;
        private String categoryId;
        private Date expiration_date;
        private String image;
        private String description;
        private Integer inventory_quantity;
        private Integer price;

        public ProductBuilder withProductName(String productName) {
            this.productName = productName;
            return this;
        }

        public ProductBuilder withProductionDate(Date production_date) {
            this.production_date = production_date;
            return this;
        }

        public ProductBuilder withUnit(String unit) {
            this.unit = unit;
            return this;
        }

        public ProductBuilder withSupplierId(String supplierId) {
            this.supplierId = supplierId;
            return this;
        }

        public ProductBuilder withCategoryId(String categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public ProductBuilder withExpirationDate(Date expiration_date) {
            this.expiration_date = expiration_date;
            return this;
        }

        public ProductBuilder withImage(String image) {
            this.image = image;
            return this;
        }

        public ProductBuilder withDescription(String description) {
            this.description = description;
            return this;
        }

        public ProductBuilder withInventoryQuantity(Integer inventory_quantity) {
            this.inventory_quantity = inventory_quantity;
            return this;
        }

        public ProductBuilder withPrice(Integer price) {
            this.price = price;
            return this;
        }

        public Product build() {
            Product product = new Product();
            product.setProductName(this.productName);
            product.setProduction_date(this.production_date);
            product.setUnit(this.unit);
            product.setSupplierId(this.supplierId);
            product.setCategoryId(this.categoryId);
            product.setExpiration_date(this.expiration_date);
            product.setImage(this.image);
            product.setDescription(this.description);
            product.setInventory_quantity(this.inventory_quantity);
            product.setPrice(this.price != null ? this.price : 0);
            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());
            return product;
        }
    }
}
