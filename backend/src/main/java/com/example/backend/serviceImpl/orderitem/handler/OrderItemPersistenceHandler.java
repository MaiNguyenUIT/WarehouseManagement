package com.example.backend.serviceImpl.orderitem.handler;

import com.example.backend.model.OrderItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderItemPersistenceHandler implements OrderItemProcessingHandler {
  private OrderItemProcessingHandler nextHandler; // Thường là null cho handler cuối cùng
  private final OrderItemRepository orderItemRepository;

  @Autowired
  public OrderItemPersistenceHandler(OrderItemRepository orderItemRepository) {
    this.orderItemRepository = orderItemRepository;
  }

  @Override
  public void setNextHandler(OrderItemProcessingHandler nextHandler) {
    this.nextHandler = nextHandler;
  }

  @Override
  public void process(OrderItemProcessingContext context) throws Exception {
    OrderItem savedOrderItem = orderItemRepository.save(context.getOrderItemResult());
    context.setOrderItemResult(savedOrderItem); // Cập nhật lại context với đối tượng đã có ID từ DB

    // Không gọi nextHandler vì đây là handler cuối cùng (trừ khi có
    // post-processing)
    if (nextHandler != null) {
      // Nếu có handler sau lưu trữ (ví dụ: logging, notification)
      nextHandler.process(context);
    }
  }
}