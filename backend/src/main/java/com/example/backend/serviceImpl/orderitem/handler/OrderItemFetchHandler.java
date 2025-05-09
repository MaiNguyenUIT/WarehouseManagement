package com.example.backend.serviceImpl.orderitem.handler;

import com.example.backend.model.OrderItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class OrderItemFetchHandler implements OrderItemProcessingHandler {
  private OrderItemProcessingHandler nextHandler;
  private final OrderItemRepository orderItemRepository;

  @Autowired
  public OrderItemFetchHandler(OrderItemRepository orderItemRepository) {
    this.orderItemRepository = orderItemRepository;
  }

  @Override
  public void setNextHandler(OrderItemProcessingHandler nextHandler) {
    this.nextHandler = nextHandler;
  }

  @Override
  public void process(OrderItemProcessingContext context) throws Exception {
    // Giả sử ID của OrderItem cần xóa được truyền qua một trường mới trong context
    // Hoặc context được khởi tạo với OrderItem đã được fetch từ trước
    // Ở đây, chúng ta sẽ giả định context đã chứa orderItemInput là đối tượng cần
    // xóa
    // Nếu context chưa có, bạn cần logic để fetch nó bằng ID.
    // Ví dụ:
    // String orderItemIdToDelete = context.getOrderItemIdToDelete(); // Cần thêm
    // trường này vào context
    // Optional<OrderItem> orderItemOpt =
    // orderItemRepository.findById(orderItemIdToDelete);

    // Trong thiết kế hiện tại của context, orderItemResult sẽ là orderItem cần xử
    // lý
    // Nếu process được gọi từ service với context đã có sẵn orderItem thì không cần
    // fetch lại.
    // Nếu context chỉ có ID, thì fetch ở đây:
    if (context.getOrderItemResult() == null && context.getOrderItemInput() != null
        && context.getOrderItemInput().getOrderItem_id() != null) {
      Optional<OrderItem> orderItemOpt = orderItemRepository.findById(context.getOrderItemInput().getOrderItem_id());
      if (orderItemOpt.isEmpty()) {
        throw new Exception(
            "OrderItem with ID: " + context.getOrderItemInput().getOrderItem_id() + " not found for deletion.");
      }
      context.setOrderItemResult(orderItemOpt.get()); // Đặt OrderItem đã fetch vào result để các handler sau dùng
    } else if (context.getOrderItemResult() == null) {
      throw new Exception("OrderItem to delete is not available in the context.");
    }

    if (nextHandler != null) {
      nextHandler.process(context);
    }
  }
}