package com.example.backend.serviceImpl.orderitem.template;

import com.example.backend.model.OrderItem;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import org.springframework.transaction.annotation.Transactional;

public abstract class OrderItemProcessingTemplate {

  // Template method - định nghĩa luồng xử lý chung
  @Transactional
  public final OrderItem processOrderItem(OrderItemProcessingContext context) throws Exception {
    validateInput(context);

    if (context.isUpdateOperation()) {
      fetchExistingOrderItem(context);
    }

    validateProduct(context);
    calculatePrice(context);
    updateInventory(context);
    setupOrderItem(context);

    return persistOrderItem(context);
  }

  @Transactional
  public final void deleteOrderItem(OrderItemProcessingContext context) throws Exception {
    fetchExistingOrderItem(context);
    validateDeletion(context);
    revertInventory(context);
    performDeletion(context);
  }

  // Abstract methods - phải được implement bởi subclass
  protected abstract void validateInput(OrderItemProcessingContext context) throws Exception;

  protected abstract void fetchExistingOrderItem(OrderItemProcessingContext context) throws Exception;

  protected abstract void validateProduct(OrderItemProcessingContext context) throws Exception;

  protected abstract void calculatePrice(OrderItemProcessingContext context) throws Exception;

  protected abstract void updateInventory(OrderItemProcessingContext context) throws Exception;

  protected abstract void setupOrderItem(OrderItemProcessingContext context) throws Exception;

  protected abstract OrderItem persistOrderItem(OrderItemProcessingContext context) throws Exception;

  // Deletion methods
  protected abstract void validateDeletion(OrderItemProcessingContext context) throws Exception;

  protected abstract void revertInventory(OrderItemProcessingContext context) throws Exception;

  protected abstract void performDeletion(OrderItemProcessingContext context) throws Exception;

  // Hook methods - có thể override nếu cần
  protected void beforeProcessing(OrderItemProcessingContext context) throws Exception {
    // Default implementation - do nothing
  }

  protected void afterProcessing(OrderItemProcessingContext context) throws Exception {
    // Default implementation - do nothing
  }
}