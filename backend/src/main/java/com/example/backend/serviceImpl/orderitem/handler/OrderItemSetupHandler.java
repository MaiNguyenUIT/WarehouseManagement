package com.example.backend.serviceImpl.orderitem.handler;

import com.example.backend.model.OrderItem;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import org.springframework.stereotype.Component;

@Component
public class OrderItemSetupHandler implements OrderItemProcessingHandler {
  private OrderItemProcessingHandler nextHandler;

  @Override
  public void setNextHandler(OrderItemProcessingHandler nextHandler) {
    this.nextHandler = nextHandler;
  }

  @Override
  public void process(OrderItemProcessingContext context) throws Exception {
    OrderItem orderItemInput = context.getOrderItemInput();
    OrderItem orderItemResult = context.getOrderItemResult(); // orderItemResult đã được khởi tạo trong context

    orderItemResult.setProduct_id(orderItemInput.getProduct_id());
    orderItemResult.setQuantity(orderItemInput.getQuantity());
    // totalPrice đã được tính ở handler trước và set vào orderItemResult
    orderItemResult.setOrderItemCode(orderItemInput.getOrderItemCode());
    orderItemResult.setShelfCode(orderItemInput.getShelfCode());
    // orderItemResult.setOrderItemState() // Mặc định là OUT_ORDER, có thể set ở
    // đây nếu cần

    if (nextHandler != null) {
      nextHandler.process(context);
    }
  }
}