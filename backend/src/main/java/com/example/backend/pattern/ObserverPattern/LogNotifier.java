package com.example.backend.pattern.ObserverPattern;

import com.example.backend.model.Product;

import java.util.List;

public class LogNotifier implements ProductExpiryObserver {

    @Override
    public void notify(List<Product> products) {
        for(Product product : products){
            System.out.println("📧 Log: Sản phẩm " + product.getProductName() + " sắp hết hạn.");
        }
    }
}
