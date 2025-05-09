package com.example.backend.serviceImpl.orderitem.handler;

import com.example.backend.ENUM.PRODUCT_STATUS;
import com.example.backend.model.Inventory;
import com.example.backend.model.OrderItem;
import com.example.backend.model.Product;
import com.example.backend.model.Shelf;
import com.example.backend.repository.InventoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ShelfRepository;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
public class InventoryReversalHandler implements OrderItemProcessingHandler {
  private OrderItemProcessingHandler nextHandler;
  private final ProductRepository productRepository;
  private final ShelfRepository shelfRepository;
  private final InventoryRepository inventoryRepository;

  @Autowired
  public InventoryReversalHandler(ProductRepository productRepository,
      ShelfRepository shelfRepository,
      InventoryRepository inventoryRepository) {
    this.productRepository = productRepository;
    this.shelfRepository = shelfRepository;
    this.inventoryRepository = inventoryRepository;
  }

  @Override
  public void setNextHandler(OrderItemProcessingHandler nextHandler) {
    this.nextHandler = nextHandler;
  }

  @Override
  @Transactional // Đảm bảo tính toàn vẹn
  public void process(OrderItemProcessingContext context) throws Exception {
    OrderItem orderItemToDelete = context.getOrderItemResult(); // Lấy từ context (đã được fetch bởi handler trước)
    if (orderItemToDelete == null) {
      throw new Exception("OrderItem not found in context for inventory reversal.");
    }

    Optional<Product> productOpt = productRepository.findById(orderItemToDelete.getProduct_id());
    if (productOpt.isPresent()) {
      Product product = productOpt.get();
      product.setInventory_quantity(product.getInventory_quantity() + orderItemToDelete.getQuantity());
      if (product.getInventory_quantity() > 0) {
        product.setProductStatus(PRODUCT_STATUS.IN_STOCK);
      }
      productRepository.save(product);
      context.setProductOptional(Optional.of(product)); // Cập nhật product trong context

      // Hoàn trả số lượng cho kệ
      if (orderItemToDelete.getShelfCode() != null && !orderItemToDelete.getShelfCode().isEmpty()) {
        // Giả định logic tương tự: một OrderItem liên kết với một hoặc nhiều kệ cụ thể.
        // Ví dụ đơn giản cho một kệ:
        for (String shelfCodeStr : orderItemToDelete.getShelfCode()) {
          Shelf shelf = shelfRepository.findByshelfCode(shelfCodeStr);
          if (shelf != null) {
            // Nếu kệ này trước đó đã bị xóa do hết hàng khi tạo orderItem,
            // thì bây giờ khi xóa orderItem, có thể không cần tạo lại kệ đó,
            // mà chỉ đơn giản là đã hoàn trả số lượng cho Product.
            // Logic này phụ thuộc vào yêu cầu nghiệp vụ: Kệ có tự động được tạo lại không?
            // Ở đây giả định kệ vẫn tồn tại và chỉ cập nhật số lượng.
            shelf.setQuantity(shelf.getQuantity() + orderItemToDelete.getQuantity());

            // Nếu sản phẩm trên kệ trước đó là null (kệ trống) hoặc khớp, thì cập nhật
            // productId
            // Điều này quan trọng nếu một kệ có thể chứa nhiều loại sản phẩm (ít phổ biến)
            // hoặc nếu kệ được "giải phóng" khi sản phẩm = 0
            if (shelf.getProductId() == null || shelf.getProductId().equals(product.getId())) {
              shelf.setProductId(product.getId()); // Đảm bảo kệ được liên kết lại với sản phẩm
            }
            shelfRepository.save(shelf);

            // Cập nhật lại số lượng inventory
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
              context.setInventoryOptional(Optional.of(inventory));
            }
          } else {
            // Ghi log nếu không tìm thấy kệ, có thể do kệ đã bị xóa trước đó
            System.err.println("Warning: Shelf with code " + shelfCodeStr
                + " not found during inventory reversal for OrderItem ID: " + orderItemToDelete.getOrderItem_id());
          }
        }
      }
    } else {
      // Ghi log nếu không tìm thấy sản phẩm, dữ liệu có thể không nhất quán
      System.err.println("Warning: Product with ID " + orderItemToDelete.getProduct_id()
          + " not found during inventory reversal for OrderItem ID: " + orderItemToDelete.getOrderItem_id());
    }

    if (nextHandler != null) {
      nextHandler.process(context);
    }
  }
}