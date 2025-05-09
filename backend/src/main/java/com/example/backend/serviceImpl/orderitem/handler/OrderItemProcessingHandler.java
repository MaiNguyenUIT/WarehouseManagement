package com.example.backend.serviceImpl.orderitem.handler;

import com.example.backend.model.OrderItem;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext; // Sẽ tạo ở bước 3

public interface OrderItemProcessingHandler {
  void setNextHandler(OrderItemProcessingHandler nextHandler);

  void process(OrderItemProcessingContext context) throws Exception;
}