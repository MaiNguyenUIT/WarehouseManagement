package com.example.backend.pattern.ObserverPattern;

import com.example.backend.model.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductExpiryNotifier {
    private final List<ProductExpiryObserver> observers = new ArrayList<>();

    public void addObserver(ProductExpiryObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(ProductExpiryObserver observer) {
        observers.remove(observer);
    }

    public void notifyObservers(List<Product> product) {
        for (ProductExpiryObserver observer : observers) {
            observer.notify(product);
        }
    }
}
