package com.example.backend.pattern.ObserverPattern;

import com.example.backend.model.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductExpiryPublisher {
    private final List<ProductExpirySubcriber> observers = new ArrayList<>();

    public void addObserver(ProductExpirySubcriber observer) {
        observers.add(observer);
    }

    public void removeObserver(ProductExpirySubcriber observer) {
        observers.remove(observer);
    }

    public void notifyObservers(List<Product> product) {
        for (ProductExpirySubcriber observer : observers) {
            observer.notify(product);
        }
    }
}
