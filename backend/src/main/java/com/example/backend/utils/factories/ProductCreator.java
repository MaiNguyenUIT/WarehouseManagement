package com.example.backend.utils.factories;

import com.example.backend.model.BaseModel;
import com.example.backend.model.Product;
import com.example.backend.respone.ProductRespone;
import com.example.backend.request.ProductRequest;
import com.example.backend.utils.factories.EntityCreator;
import java.time.LocalDateTime;

public class ProductCreator extends EntityCreator {
    private ProductCreator() {}
    private static class SingletonHelper {
        private static final ProductCreator INSTANCE = new ProductCreator();
    }

    public static ProductCreator getInstance() {
        return SingletonHelper.INSTANCE;
    }

    @Override
    protected BaseModel createSpecificEntityInstance() {
        return new Product();
    }

    public Product createProductFromRequest(ProductRequest productRequest) {
        Product baseProduct = (Product) createAndPrepareEntity();

        Product newProduct = new Product.ProductBuilder()
                .withProductName(productRequest.getProductName())
                .withProductionDate(productRequest.getProduction_date())
                .withUnit(productRequest.getUnit())
                .withSupplierId(productRequest.getSupplierId())
                .withCategoryId(productRequest.getCategoryId())
                .withExpirationDate(productRequest.getExpiration_date())
                .withImage(productRequest.getImage())
                .withDescription(productRequest.getDescription())
                .withInventoryQuantity(productRequest.getInventory_quantity())
                .withPrice(productRequest.getPrice())
                .withCreatedAt(baseProduct.getCreatedAt())
                .withUpdatedAt(baseProduct.getUpdatedAt())
                .build();

        return newProduct;
    }

}
