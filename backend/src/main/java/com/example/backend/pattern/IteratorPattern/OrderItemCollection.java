package com.example.backend.pattern.IteratorPattern;

import com.example.backend.model.OrderItem;

public interface OrderItemCollection {
    Iterator<OrderItem> createIterator();
}
