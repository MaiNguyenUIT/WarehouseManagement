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
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
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
  protected void validateInput(OrderItemProcessingContext context) throws Exception {
    OrderItem input = context.getOrderItemInput();
    if (input == null) {
      throw new Exception("OrderItem input cannot be null");
    }

    // Kiểm tra mã OrderItem đã tồn tại (chỉ cho create)
    if (!context.isUpdateOperation()) {
      OrderItem existingOrderItem = orderItemRepository.findByorderItemCode(input.getOrderItemCode());
      if (existingOrderItem != null) {
        throw new Exception("OrderItem code is already exist");
      }
    }
  }

  @Override
  protected void fetchExistingOrderItem(OrderItemProcessingContext context) throws Exception {
    if (context.getOrderItemResult() == null && context.getOrderItemInput() != null
        && context.getOrderItemInput().getOrderItem_id() != null) {
      Optional<OrderItem> orderItemOpt = orderItemRepository.findById(context.getOrderItemInput().getOrderItem_id());
      if (orderItemOpt.isEmpty()) {
        throw new Exception("OrderItem with ID: " + context.getOrderItemInput().getOrderItem_id() + " not found.");
      }
      context.setOrderItemResult(orderItemOpt.get());
    } else if (context.getOrderItemResult() == null) {
      throw new Exception("OrderItem not available in the context.");
    }
  }

  @Override
  protected void validateProduct(OrderItemProcessingContext context) throws Exception {
    String productId = context.getOrderItemInput().getProduct_id();
    Optional<Product> productOpt = productRepository.findById(productId);

    if (productOpt.isEmpty()) {
      throw new Exception("Product not found with ID: " + productId);
    }

    Product product = productOpt.get();
    int requestedQuantity = context.getOrderItemInput().getQuantity();

    if (product.getInventory_quantity() < requestedQuantity) {
      throw new Exception("Not enough product quantity. Available: " + product.getInventory_quantity() + ", Requested: "
          + requestedQuantity);
    }

    context.setProductOptional(Optional.of(product));
  }

  @Override
  protected void calculatePrice(OrderItemProcessingContext context) throws Exception {
    Product product = context.getProductOptional()
        .orElseThrow(() -> new Exception("Product not found in context"));

    int quantity = context.getOrderItemInput().getQuantity();
    int totalPrice = product.getPrice() * quantity;

    context.getOrderItemResult().setTotalPrice(totalPrice);
  }

  @Override
  protected void updateInventory(OrderItemProcessingContext context) throws Exception {
    Product product = context.getProductOptional()
        .orElseThrow(() -> new Exception("Product not found in context"));

    OrderItem orderItemInput = context.getOrderItemInput();
    int quantityToProcess = orderItemInput.getQuantity();

    // Xử lý cho update operation
    if (context.isUpdateOperation()) {
      OrderItem existingOrderItem = context.getOrderItemResult();
      int oldQuantity = existingOrderItem.getQuantity();
      // Hoàn trả số lượng cũ
      product.setInventory_quantity(product.getInventory_quantity() + oldQuantity);
    }

    // Trừ số lượng mới
    product.setInventory_quantity(product.getInventory_quantity() - quantityToProcess);

    if (product.getInventory_quantity() == 0) {
      product.setProductStatus(PRODUCT_STATUS.OUT_STOCK);
    } else if (product.getInventory_quantity() < 0) {
      throw new Exception("Product inventory quantity cannot be negative.");
    } else {
      product.setProductStatus(PRODUCT_STATUS.IN_STOCK);
    }

    productRepository.save(product);

    // Cập nhật kệ
    updateShelfInventory(context, product, quantityToProcess);
  }

  private void updateShelfInventory(OrderItemProcessingContext context, Product product, int quantityToProcess)
      throws Exception {
    OrderItem orderItemInput = context.getOrderItemInput();

    if (orderItemInput.getShelfCode() == null || orderItemInput.getShelfCode().isEmpty()) {
      throw new Exception("Shelf code is required for inventory update.");
    }

    String targetShelfCode = orderItemInput.getShelfCode().get(0);
    Shelf shelf = shelfRepository.findByshelfCode(targetShelfCode);

    if (shelf == null) {
      throw new Exception("Shelf with code " + targetShelfCode + " not found.");
    }

    if (shelf.getProductId() != null && !shelf.getProductId().equals(product.getId())) {
      throw new Exception("Shelf " + targetShelfCode + " already contains a different product.");
    }

    // Cập nhật số lượng kệ
    if (context.isUpdateOperation()) {
      OrderItem existingOrderItem = context.getOrderItemResult();
      shelf.setQuantity(shelf.getQuantity() + existingOrderItem.getQuantity() - quantityToProcess);
    } else {
      shelf.setQuantity(shelf.getQuantity() - quantityToProcess);
    }

    if (shelf.getQuantity() < 0) {
      throw new Exception("Shelf quantity cannot be negative for shelf " + targetShelfCode);
    }

    if (shelf.getQuantity() == 0 && !context.isUpdateOperation()) {
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
  protected void setupOrderItem(OrderItemProcessingContext context) throws Exception {
    OrderItem orderItemInput = context.getOrderItemInput();
    OrderItem orderItemResult = context.getOrderItemResult();

    orderItemResult.setProduct_id(orderItemInput.getProduct_id());
    orderItemResult.setQuantity(orderItemInput.getQuantity());
    orderItemResult.setOrderItemCode(orderItemInput.getOrderItemCode());
    orderItemResult.setShelfCode(orderItemInput.getShelfCode());
  }

  @Override
  protected OrderItem persistOrderItem(OrderItemProcessingContext context) throws Exception {
    return orderItemRepository.save(context.getOrderItemResult());
  }

  @Override
  protected void validateDeletion(OrderItemProcessingContext context) throws Exception {
    OrderItem orderItem = context.getOrderItemResult();
    if (orderItem == null) {
      throw new Exception("OrderItem not found for deletion");
    }
  }

  @Override
  protected void revertInventory(OrderItemProcessingContext context) throws Exception {
    OrderItem orderItemToDelete = context.getOrderItemResult();

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
  protected void performDeletion(OrderItemProcessingContext context) throws Exception {
    OrderItem orderItemToDelete = context.getOrderItemResult();
    orderItemRepository.deleteById(orderItemToDelete.getOrderItem_id());
  }
}