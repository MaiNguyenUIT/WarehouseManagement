package com.example.backend.pattern.IteratorPattern;

import com.example.backend.pattern.IteratorPattern.OrderItemIterator;
import com.example.backend.model.OrderItem;
import java.util.List;

public class OrderItemCollection {
    private final List<OrderItem> orderItems;

    public OrderItemCollection(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public com.example.backend.pattern.IteratorPattern.OrderItemIterator createIterator() {
        return new OrderItemIterator(orderItems);
    }
}

