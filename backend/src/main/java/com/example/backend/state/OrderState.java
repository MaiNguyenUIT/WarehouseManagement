package com.example.backend.state;

import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.model.Order;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.request.OrderItemRequest;

public interface OrderState {

  void confirmOrder(Order order) throws Exception;

  void shipOrder(Order order) throws Exception;

  void deliverOrder(Order order) throws Exception;

  void cancelOrder(Order order, OrderItemRepository orderItemRepository) throws Exception;

  void updateOrderDetails(Order order, OrderItemRequest request, OrderItemRepository orderItemRepository)
      throws Exception;

  ORDER_STATE getStateEnum();

  // Helper method để xử lý lỗi cho các hành động không hợp lệ
  default void throwInvalidOperation() throws Exception {
    throw new Exception("Operation not allowed in state: " + getStateEnum());
  }
}