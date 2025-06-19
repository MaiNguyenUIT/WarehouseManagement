package com.example.backend.pattern.IteratorPattern;

import com.example.backend.model.OrderItem;
import java.util.List;

public class OrderItemList implements OrderItemCollection {
    private final List<OrderItem> orderItems;

    public OrderItemList(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    @Override
    public Iterator<OrderItem> createIterator() {
        return new OrderItemIterator(orderItems);
    }
}
