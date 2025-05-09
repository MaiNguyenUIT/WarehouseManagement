package com.example.backend.state;

import com.example.backend.ENUM.ORDER_ITEM_STATE;
import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.ENUM.ORDER_STATUS;
import com.example.backend.model.Order;
import com.example.backend.model.OrderItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.request.OrderItemRequest;

import java.time.LocalDate;

public class PendingState implements OrderState {

  @Override
  public void confirmOrder(Order order) throws Exception {
    order.setCurrentState(OrderStateFactory.getState(ORDER_STATE.CONFIRMED));
    order.setUpdate_at(LocalDate.now());
    System.out.println("Order " + order.getOrderCode() + " confirmed.");
  }

  @Override
  public void shipOrder(Order order) throws Exception {
    throwInvalidOperation();
  }

  @Override
  public void deliverOrder(Order order) throws Exception {
    throwInvalidOperation();
  }

  @Override
  public void cancelOrder(Order order, OrderItemRepository orderItemRepository) throws Exception {
    for (String orderItemCode : order.getOrderItem_code()) {
      OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
      if (orderItem != null) { // Kiểm tra null phòng trường hợp dữ liệu không nhất quán
        orderItem.setOrderItemState(ORDER_ITEM_STATE.OUT_ORDER);
        orderItemRepository.save(orderItem);
      }
    }
    order.setOrderStatus(ORDER_STATUS.OUT_EXPORT);
    order.setCurrentState(OrderStateFactory.getState(ORDER_STATE.CANCELLED));
    order.setUpdate_at(LocalDate.now());
    System.out.println("Order " + order.getOrderCode() + " cancelled.");
  }

  @Override
  public void updateOrderDetails(Order order, OrderItemRequest request, OrderItemRepository orderItemRepository)
      throws Exception {

    order.setUpdate_at(LocalDate.now());
    order.setDelivery_Address(request.getDelivery_Address());

    order.setOrderItem_code(request.getOrderItem_code());
    order.setOrderItem_quantity(request.getOrderItem_code().size());

    int totalPrice = 0;
    for (String orderItemCode : request.getOrderItem_code()) {
      OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
      if (orderItem == null) {
        throw new Exception("Order item with code " + orderItemCode + " not found.");
      }
      totalPrice += orderItem.getTotalPrice();
      if (orderItem.getOrderItemState() == ORDER_ITEM_STATE.OUT_ORDER) {
        orderItem.setOrderItemState(ORDER_ITEM_STATE.IN_ORDER);
        orderItemRepository.save(orderItem);
      }
    }

    order.setOrderPrice(totalPrice);
    System.out.println("Order " + order.getOrderCode() + " details updated.");
  }

  @Override
  public ORDER_STATE getStateEnum() {
    return ORDER_STATE.PENDING;
  }
}