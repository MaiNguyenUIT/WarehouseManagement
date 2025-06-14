package com.example.backend.serviceImpl.orderitem.template;

import com.example.backend.model.OrderItem;
import org.springframework.transaction.annotation.Transactional;

public abstract class OrderItemProcessingTemplate {

  // Template method - định nghĩa luồng xử lý chung
  @Transactional
  public final OrderItem processOrderItem(OrderItem orderItemInput, boolean isUpdate) throws Exception {
    validateInput(orderItemInput, isUpdate);

    OrderItem existingOrderItem = null;
    if (isUpdate) {
      existingOrderItem = fetchExistingOrderItem(orderItemInput);
    }

    validateProduct(orderItemInput);
    int totalPrice = calculatePrice(orderItemInput);
    updateInventory(orderItemInput, existingOrderItem, isUpdate);

    OrderItem orderItemToSave = setupOrderItem(orderItemInput, existingOrderItem, totalPrice, isUpdate);

    return persistOrderItem(orderItemToSave);
  }

  @Transactional
  public final void deleteOrderItem(String orderItemId) throws Exception {
    OrderItem orderItemToDelete = fetchExistingOrderItemById(orderItemId);
    validateDeletion(orderItemToDelete);
    revertInventory(orderItemToDelete);
    performDeletion(orderItemToDelete);
  }

  // Abstract methods - phải được implement bởi subclass
  protected abstract void validateInput(OrderItem orderItemInput, boolean isUpdate) throws Exception;

  protected abstract OrderItem fetchExistingOrderItem(OrderItem orderItemInput) throws Exception;

  protected abstract OrderItem fetchExistingOrderItemById(String id) throws Exception;

  protected abstract void validateProduct(OrderItem orderItemInput) throws Exception;

  protected abstract int calculatePrice(OrderItem orderItemInput) throws Exception;

  protected abstract void updateInventory(OrderItem orderItemInput, OrderItem existingOrderItem, boolean isUpdate)
      throws Exception;

  protected abstract OrderItem setupOrderItem(OrderItem orderItemInput, OrderItem existingOrderItem, int totalPrice,
      boolean isUpdate) throws Exception;

  protected abstract OrderItem persistOrderItem(OrderItem orderItem) throws Exception;

  // Deletion methods
  protected abstract void validateDeletion(OrderItem orderItem) throws Exception;

  protected abstract void revertInventory(OrderItem orderItem) throws Exception;

  protected abstract void performDeletion(OrderItem orderItem) throws Exception;
}