package com.example.backend.pattern.ObserverPattern;

import com.example.backend.model.Product;

import java.util.List;

public interface ProductExpirySubcriber {
    void notify(List<Product> product);
}
