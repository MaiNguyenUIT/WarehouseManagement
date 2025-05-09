package com.example.backend.serviceImpl.orderitem;

import com.example.backend.model.Inventory;
import com.example.backend.model.OrderItem;
import com.example.backend.model.Product;
import com.example.backend.model.Shelf; // Giả sử bạn có thể cần truy cập nhiều Shelf
import java.util.List;
import java.util.Optional;

// Lombok có thể dùng ở đây để giảm code getter/setter
public class OrderItemProcessingContext {
  private OrderItem orderItemInput; // OrderItem từ request
  private OrderItem orderItemResult; // OrderItem sẽ được lưu
  private Optional<Product> productOptional;
  private List<Shelf> shelvesToUpdate; // Danh sách các Shelf cần cập nhật
  private Optional<Inventory> inventoryOptional;
  private boolean isUpdateOperation = false; // Cờ để phân biệt create và update

  // Constructor, getters, setters
  public OrderItemProcessingContext(OrderItem orderItemInput, boolean isUpdateOperation) {
    this.orderItemInput = orderItemInput;
    this.orderItemResult = new OrderItem(); // Khởi tạo cho create
    this.isUpdateOperation = isUpdateOperation;
  }

  public OrderItemProcessingContext(OrderItem orderItemInput, OrderItem existingOrderItem, boolean isUpdateOperation) {
    this.orderItemInput = orderItemInput; // Dữ liệu mới cho update
    this.orderItemResult = existingOrderItem; // Đối tượng OrderItem hiện có để cập nhật
    this.isUpdateOperation = isUpdateOperation;
  }

  // Getters and Setters cho các trường
  public OrderItem getOrderItemInput() {
    return orderItemInput;
  }

  public void setOrderItemInput(OrderItem orderItemInput) {
    this.orderItemInput = orderItemInput;
  }

  public OrderItem getOrderItemResult() {
    return orderItemResult;
  }

  public void setOrderItemResult(OrderItem orderItemResult) {
    this.orderItemResult = orderItemResult;
  }

  public Optional<Product> getProductOptional() {
    return productOptional;
  }

  public void setProductOptional(Optional<Product> productOptional) {
    this.productOptional = productOptional;
  }

  public List<Shelf> getShelvesToUpdate() {
    return shelvesToUpdate;
  }

  public void setShelvesToUpdate(List<Shelf> shelvesToUpdate) {
    this.shelvesToUpdate = shelvesToUpdate;
  }

  public Optional<Inventory> getInventoryOptional() {
    return inventoryOptional;
  }

  public void setInventoryOptional(Optional<Inventory> inventoryOptional) {
    this.inventoryOptional = inventoryOptional;
  }

  public boolean isUpdateOperation() {
    return isUpdateOperation;
  }

  public void setUpdateOperation(boolean updateOperation) {
    isUpdateOperation = updateOperation;
  }
}