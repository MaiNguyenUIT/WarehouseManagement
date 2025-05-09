package com.example.backend.state;

import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.model.Order;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.request.OrderItemRequest;

public class DeliveredState implements OrderState {

  @Override
  public void confirmOrder(Order order) throws Exception {
    throwInvalidOperation();
  }

  @Override
  public void shipOrder(Order order) throws Exception {
    throwInvalidOperation();
  }

  @Override
  public void deliverOrder(Order order) throws Exception {
    System.out.println("Order " + order.getOrderCode() + " is already delivered.");
  }

  @Override
  public void cancelOrder(Order order, OrderItemRepository orderItemRepository) throws Exception {
    throw new Exception("Cannot cancel a delivered order.");
  }

  @Override
  public void updateOrderDetails(Order order, OrderItemRequest request, OrderItemRepository orderItemRepository)
      throws Exception {
    throw new Exception("Cannot update details of a delivered order.");
  }

  @Override
  public ORDER_STATE getStateEnum() {
    return ORDER_STATE.DELIVERED;
  }
}