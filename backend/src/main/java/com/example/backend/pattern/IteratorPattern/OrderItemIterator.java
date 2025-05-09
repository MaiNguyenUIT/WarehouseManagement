package com.example.backend.pattern.IteratorPattern;

import com.example.backend.model.OrderItem;

import java.util.List;

public class OrderItemIterator {
    private final List<OrderItem> orderItems;
    private int position = 0;

    public OrderItemIterator(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public boolean hasNext() {
        return position < orderItems.size();
    }

    public OrderItem next() {
        return orderItems.get(position++);
    }
}
