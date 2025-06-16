package com.example.backend.utils.factories;

import com.example.backend.model.BaseModel;
import com.example.backend.model.Product;
import com.example.backend.respone.ProductRespone;
import com.example.backend.request.ProductRequest;
import com.example.backend.utils.factories.EntityFactory;
import java.time.LocalDateTime;

public class ProductFactoryManage implements EntityFactory {
    private ProductFactoryManage() {}
    private static class SingletonHelper {
        private static final ProductFactoryManage INSTANCE = new ProductFactoryManage();
    }

    public static ProductFactoryManage getInstance() {
        return SingletonHelper.INSTANCE;
    }

    @Override
    public BaseModel createEntity() {
        Product newProduct = new Product();
        return newProduct;
    }

    public Product createProductFromRequest(ProductRequest productRequest) {
        return new Product.ProductBuilder()
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
                .build();
    }

}
