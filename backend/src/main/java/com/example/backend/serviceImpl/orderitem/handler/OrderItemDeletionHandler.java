package com.example.backend.serviceImpl.orderitem.handler;

import com.example.backend.model.OrderItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class OrderItemDeletionHandler implements OrderItemProcessingHandler {
  private OrderItemProcessingHandler nextHandler; // Thường là null
  private final OrderItemRepository orderItemRepository;

  @Autowired
  public OrderItemDeletionHandler(OrderItemRepository orderItemRepository) {
    this.orderItemRepository = orderItemRepository;
  }

  @Override
  public void setNextHandler(OrderItemProcessingHandler nextHandler) {
    this.nextHandler = nextHandler;
  }

  @Override
  @Transactional
  public void process(OrderItemProcessingContext context) throws Exception {
    OrderItem orderItemToDelete = context.getOrderItemResult();
    if (orderItemToDelete == null || orderItemToDelete.getOrderItem_id() == null) {
      throw new Exception("OrderItem ID not found in context for actual deletion.");
    }
    orderItemRepository.deleteById(orderItemToDelete.getOrderItem_id());
    System.out.println("OrderItem with ID: " + orderItemToDelete.getOrderItem_id() + " successfully deleted.");

    if (nextHandler != null) {
      nextHandler.process(context);
    }
  }
}