package com.example.backend.serviceImpl.orderitem.template;

import com.example.backend.ENUM.PRODUCT_STATUS;
import com.example.backend.model.Inventory;
import com.example.backend.model.OrderItem;
import com.example.backend.model.Product;
import com.example.backend.model.Shelf;
import com.example.backend.repository.InventoryRepository;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ShelfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class StandardOrderItemProcessor extends OrderItemProcessingTemplate {

  private final OrderItemRepository orderItemRepository;
  private final ProductRepository productRepository;
  private final ShelfRepository shelfRepository;
  private final InventoryRepository inventoryRepository;

  @Autowired
  public StandardOrderItemProcessor(OrderItemRepository orderItemRepository,
      ProductRepository productRepository,
      ShelfRepository shelfRepository,
      InventoryRepository inventoryRepository) {
    this.orderItemRepository = orderItemRepository;
    this.productRepository = productRepository;
    this.shelfRepository = shelfRepository;
    this.inventoryRepository = inventoryRepository;
  }

  @Override
  protected void validateInput(OrderItem orderItemInput, boolean isUpdate) throws Exception {
    if (orderItemInput == null) {
      throw new Exception("OrderItem input cannot be null");
    }

    // Kiểm tra mã OrderItem đã tồn tại (chỉ cho create)
    if (!isUpdate) {
      OrderItem existingOrderItem = orderItemRepository.findByorderItemCode(orderItemInput.getOrderItemCode());
      if (existingOrderItem != null) {
        throw new Exception("OrderItem code already exists");
      }
    }
  }

  @Override
  protected OrderItem fetchExistingOrderItem(OrderItem orderItemInput) throws Exception {
    if (orderItemInput.getOrderItem_id() == null) {
      throw new Exception("OrderItem ID is required for update operation");
    }

    Optional<OrderItem> orderItemOpt = orderItemRepository.findById(orderItemInput.getOrderItem_id());
    if (orderItemOpt.isEmpty()) {
      throw new Exception("OrderItem with ID: " + orderItemInput.getOrderItem_id() + " not found");
    }

    return orderItemOpt.get();
  }

  @Override
  protected OrderItem fetchExistingOrderItemById(String id) throws Exception {
    Optional<OrderItem> orderItemOpt = orderItemRepository.findById(id);
    if (orderItemOpt.isEmpty()) {
      throw new Exception("OrderItem with ID: " + id + " not found");
    }

    return orderItemOpt.get();
  }

  @Override
  protected void validateProduct(OrderItem orderItemInput) throws Exception {
    String productId = orderItemInput.getProduct_id();
    Optional<Product> productOpt = productRepository.findById(productId);

    if (productOpt.isEmpty()) {
      throw new Exception("Product not found with ID: " + productId);
    }

    Product product = productOpt.get();
    int requestedQuantity = orderItemInput.getQuantity();

    if (product.getInventory_quantity() < requestedQuantity) {
      throw new Exception("Not enough product quantity. Available: " +
          product.getInventory_quantity() + ", Requested: " + requestedQuantity);
    }
  }

  @Override
  protected int calculatePrice(OrderItem orderItemInput) throws Exception {
    Optional<Product> productOpt = productRepository.findById(orderItemInput.getProduct_id());
    if (productOpt.isEmpty()) {
      throw new Exception("Product not found for price calculation");
    }

    Product product = productOpt.get();
    return product.getPrice() * orderItemInput.getQuantity();
  }

  @Override
  protected void updateInventory(OrderItem orderItemInput, OrderItem existingOrderItem, boolean isUpdate)
      throws Exception {
    Optional<Product> productOpt = productRepository.findById(orderItemInput.getProduct_id());
    if (productOpt.isEmpty()) {
      throw new Exception("Product not found for inventory update");
    }

    Product product = productOpt.get();
    int quantityToProcess = orderItemInput.getQuantity();

    // Xử lý cho update operation
    if (isUpdate && existingOrderItem != null) {
      int oldQuantity = existingOrderItem.getQuantity();
      // Hoàn trả số lượng cũ
      product.setInventory_quantity(product.getInventory_quantity() + oldQuantity);
    }

    // Trừ số lượng mới
    product.setInventory_quantity(product.getInventory_quantity() - quantityToProcess);

    if (product.getInventory_quantity() == 0) {
      product.setProductStatus(PRODUCT_STATUS.OUT_STOCK);
    } else if (product.getInventory_quantity() < 0) {
      throw new Exception("Product inventory quantity cannot be negative");
    } else {
      product.setProductStatus(PRODUCT_STATUS.IN_STOCK);
    }

    productRepository.save(product);

    // Cập nhật kệ
    updateShelfInventory(orderItemInput, existingOrderItem, product, quantityToProcess, isUpdate);
  }

  private void updateShelfInventory(OrderItem orderItemInput, OrderItem existingOrderItem,
      Product product, int quantityToProcess, boolean isUpdate) throws Exception {
    if (orderItemInput.getShelfCode() == null || orderItemInput.getShelfCode().isEmpty()) {
      throw new Exception("Shelf code is required for inventory update");
    }

    String targetShelfCode = orderItemInput.getShelfCode().get(0);
    Shelf shelf = shelfRepository.findByshelfCode(targetShelfCode);

    if (shelf == null) {
      throw new Exception("Shelf with code " + targetShelfCode + " not found");
    }

    if (shelf.getProductId() != null && !shelf.getProductId().equals(product.getId())) {
      throw new Exception("Shelf " + targetShelfCode + " already contains a different product");
    }

    // Cập nhật số lượng kệ
    if (isUpdate && existingOrderItem != null) {
      shelf.setQuantity(shelf.getQuantity() + existingOrderItem.getQuantity() - quantityToProcess);
    } else {
      shelf.setQuantity(shelf.getQuantity() - quantityToProcess);
    }

    if (shelf.getQuantity() < 0) {
      throw new Exception("Shelf quantity cannot be negative for shelf " + targetShelfCode);
    }

    if (shelf.getQuantity() == 0 && !isUpdate) {
      shelfRepository.deleteById(shelf.getId());
    } else {
      shelf.setProductId(product.getId());
      shelfRepository.save(shelf);
    }

    // Cập nhật Inventory
    updateInventoryQuantity(shelf);
  }

  private void updateInventoryQuantity(Shelf shelf) {
    Optional<Inventory> inventoryOpt = inventoryRepository.findById(shelf.getInventoryid());
    if (inventoryOpt.isPresent()) {
      Inventory inventory = inventoryOpt.get();
      int totalInventoryQuantity = 0;
      List<Shelf> shelvesInInventory = shelfRepository.findByinventoryid(inventory.getId());
      for (Shelf s : shelvesInInventory) {
        totalInventoryQuantity += s.getQuantity();
      }
      inventory.setQuantity(totalInventoryQuantity);
      inventoryRepository.save(inventory);
    }
  }

  @Override
  protected OrderItem setupOrderItem(OrderItem orderItemInput, OrderItem existingOrderItem,
      int totalPrice, boolean isUpdate) throws Exception {
    OrderItem orderItemToSave;

    if (isUpdate && existingOrderItem != null) {
      orderItemToSave = existingOrderItem;
    } else {
      orderItemToSave = new OrderItem();
    }

    orderItemToSave.setProduct_id(orderItemInput.getProduct_id());
    orderItemToSave.setQuantity(orderItemInput.getQuantity());
    orderItemToSave.setOrderItemCode(orderItemInput.getOrderItemCode());
    orderItemToSave.setShelfCode(orderItemInput.getShelfCode());
    orderItemToSave.setTotalPrice(totalPrice);

    return orderItemToSave;
  }

  @Override
  protected OrderItem persistOrderItem(OrderItem orderItem) throws Exception {
    return orderItemRepository.save(orderItem);
  }

  @Override
  protected void validateDeletion(OrderItem orderItem) throws Exception {
    if (orderItem == null) {
      throw new Exception("OrderItem not found for deletion");
    }
  }

  @Override
  protected void revertInventory(OrderItem orderItemToDelete) throws Exception {
    Optional<Product> productOpt = productRepository.findById(orderItemToDelete.getProduct_id());
    if (productOpt.isPresent()) {
      Product product = productOpt.get();
      product.setInventory_quantity(product.getInventory_quantity() + orderItemToDelete.getQuantity());

      if (product.getInventory_quantity() > 0) {
        product.setProductStatus(PRODUCT_STATUS.IN_STOCK);
      }
      productRepository.save(product);

      // Hoàn trả số lượng cho kệ
      if (orderItemToDelete.getShelfCode() != null && !orderItemToDelete.getShelfCode().isEmpty()) {
        for (String shelfCodeStr : orderItemToDelete.getShelfCode()) {
          Shelf shelf = shelfRepository.findByshelfCode(shelfCodeStr);
          if (shelf != null) {
            shelf.setQuantity(shelf.getQuantity() + orderItemToDelete.getQuantity());
            shelf.setProductId(product.getId());
            shelfRepository.save(shelf);

            updateInventoryQuantity(shelf);
          }
        }
      }
    }
  }

  @Override
  protected void performDeletion(OrderItem orderItemToDelete) throws Exception {
    orderItemRepository.deleteById(orderItemToDelete.getOrderItem_id());
  }
}