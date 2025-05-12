package com.example.backend.serviceImpl.orderitem.handler;

import com.example.backend.model.OrderItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component // Hoặc bạn tự quản lý instance
public class OrderItemCodeExistenceHandler implements OrderItemProcessingHandler {
  private OrderItemProcessingHandler nextHandler;
  private final OrderItemRepository orderItemRepository;

  @Autowired
  public OrderItemCodeExistenceHandler(OrderItemRepository orderItemRepository) {
    this.orderItemRepository = orderItemRepository;
  }

  @Override
  public void setNextHandler(OrderItemProcessingHandler nextHandler) {
    this.nextHandler = nextHandler;
  }

  @Override
  public void process(OrderItemProcessingContext context) throws Exception {
    if (!context.isUpdateOperation()) { // Chỉ kiểm tra cho create
      OrderItem existOrderItemCode = orderItemRepository
          .findByorderItemCode(context.getOrderItemInput().getOrderItemCode());
      if (existOrderItemCode != null) {
        throw new Exception("OrderItem code is already exist");
      }
    }
    if (nextHandler != null) {
      nextHandler.process(context);
    }
  }
}