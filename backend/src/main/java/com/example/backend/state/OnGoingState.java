package com.example.backend.state;

import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.model.Order;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.request.OrderItemRequest;

import java.time.LocalDate;

public class OnGoingState implements OrderState {

  @Override
  public void confirmOrder(Order order) throws Exception {
    throwInvalidOperation();
  }

  @Override
  public void shipOrder(Order order) throws Exception {
    System.out.println("Order " + order.getOrderCode() + " is already on the way.");
  }

  @Override
  public void deliverOrder(Order order) throws Exception {
    // Logic chuyển sang DELIVERED
    order.setCurrentState(OrderStateFactory.getState(ORDER_STATE.DELIVERED));
    order.setUpdate_at(LocalDate.now());
    System.out.println("Order " + order.getOrderCode() + " delivered.");
  }

  @Override
  public void cancelOrder(Order order, OrderItemRepository orderItemRepository) throws Exception {
    throw new Exception("Cannot cancel order while it's on the way.");
  }

  @Override
  public void updateOrderDetails(Order order, OrderItemRequest request, OrderItemRepository orderItemRepository)
      throws Exception {
    throw new Exception("Cannot update order details while it's on the way.");
  }

  @Override
  public ORDER_STATE getStateEnum() {
    return ORDER_STATE.ON_GOING;
  }
}