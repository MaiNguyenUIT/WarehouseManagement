package com.example.backend.service;

import com.example.backend.model.OrderItem;
import com.example.backend.request.OrderItemRequest;

import java.util.List;
import java.util.Optional;

public interface OrderItemService {
    OrderItem createOrderItem(OrderItem orderItem) throws Exception;

    OrderItem updateOrderItem(OrderItem orderItem, String orderItemId) throws Exception;

    void deleteOrderItem(String id) throws Exception;

    Optional<OrderItem> getOrderItemById(String id);

    List<OrderItem> getAllOrderItem();

    List<String> getAllOrderItemCode();

    OrderItem getOrderByOrderItemCode(String orderItemCode);
}
