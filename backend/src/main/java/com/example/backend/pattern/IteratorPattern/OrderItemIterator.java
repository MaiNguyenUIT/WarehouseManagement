package com.example.backend.pattern.IteratorPattern;

import com.example.backend.model.OrderItem;
import java.util.List;

public class OrderItemIterator implements Iterator<OrderItem> {
    private final List<OrderItem> orderItems;
    private int position = 0;

    public OrderItemIterator(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    @Override
    public boolean hasNext() {
        return position < orderItems.size();
    }

    @Override
    public OrderItem next() {
        return orderItems.get(position++);
    }
}
