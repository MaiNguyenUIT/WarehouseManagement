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
import org.springframework.transaction.annotation.Transactional; // Quan trọng

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class InventoryUpdateHandler implements OrderItemProcessingHandler {
  private OrderItemProcessingHandler nextHandler;
  private final ProductRepository productRepository;
  private final ShelfRepository shelfRepository;
  private final InventoryRepository inventoryRepository;

  @Autowired
  public InventoryUpdateHandler(ProductRepository productRepository,
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
  @Transactional // Đảm bảo các thao tác DB là atomic
  public void process(OrderItemProcessingContext context) throws Exception {
    Product product = context.getProductOptional()
        .orElseThrow(() -> new Exception("Product not found in context for inventory update."));
    OrderItem orderItemInput = context.getOrderItemInput();
    int quantityToProcess = orderItemInput.getQuantity();
    int originalProductInventoryQuantity = product.getInventory_quantity();

    List<Shelf> shelvesUpdated = new ArrayList<>();
    context.setShelvesToUpdate(shelvesUpdated); // Lưu các kệ đã cập nhật vào context nếu cần

    // Logic cho việc update phức tạp hơn, cần xử lý hoàn trả số lượng cũ trước khi
    // trừ số lượng mới
    if (context.isUpdateOperation()) {
      OrderItem existingOrderItem = context.getOrderItemResult(); // Đây là OrderItem cũ trước khi update
      int oldQuantity = existingOrderItem.getQuantity();

      // 1. Hoàn trả số lượng cũ của Product
      product.setInventory_quantity(product.getInventory_quantity() + oldQuantity);
      // (Logic hoàn trả cho Shelf và Inventory tương ứng)
      // Giả sử Product ID không thay đổi, nếu thay đổi thì còn phức tạp hơn
      // Cần xem xét việc hoàn trả cho các kệ cũ của existingOrderItem

      // Tạm thời đơn giản hóa: Ghi đè product với số lượng đã hoàn trả
      // Sau đó logic trừ bên dưới sẽ trừ đi số lượng mới
    }

    // Xử lý giảm số lượng sản phẩm và cập nhật kệ
    if (originalProductInventoryQuantity - (context.isUpdateOperation() ? 0 : quantityToProcess) < 0
        && context.isUpdateOperation()
        && (originalProductInventoryQuantity + context.getOrderItemResult().getQuantity() - quantityToProcess < 0)) {
      throw new Exception("Product quantity in inventory is not enough after considering update.");
    }

    product.setInventory_quantity(product.getInventory_quantity() - quantityToProcess);
    if (product.getInventory_quantity() == 0) {
      product.setProductStatus(PRODUCT_STATUS.OUT_STOCK);
    } else if (product.getInventory_quantity() < 0) {
      // Điều này không nên xảy ra nếu ProductValidationHandler hoạt động đúng
      throw new Exception("Product inventory quantity cannot be negative.");
    } else {
      product.setProductStatus(PRODUCT_STATUS.IN_STOCK); // Đảm bảo trạng thái đúng
    }
    productRepository.save(product);

    // Cập nhật kệ và kho
    // Giả sử orderItemInput.getShelfCode() chỉ chứa MỘT shelfCode cho đơn giản
    // Nếu có nhiều kệ, logic sẽ phức tạp hơn để phân bổ số lượng
    if (orderItemInput.getShelfCode() == null || orderItemInput.getShelfCode().isEmpty()) {
      throw new Exception("Shelf code is required for inventory update.");
    }

    // Logic cập nhật kệ (giống với logic cũ của bạn, cần điều chỉnh cho phù hợp)
    // Ví dụ cho trường hợp một shelf code:
    String targetShelfCode = orderItemInput.getShelfCode().get(0); // Lấy kệ đầu tiên
    Shelf shelf = shelfRepository.findByshelfCode(targetShelfCode);
    if (shelf == null) {
      throw new Exception("Shelf with code " + targetShelfCode + " not found.");
    }
    // Kiểm tra xem sản phẩm trên kệ có khớp không nếu kệ đã có sản phẩm
    if (shelf.getProductId() != null && !shelf.getProductId().equals(product.getId())) {
      throw new Exception("Shelf " + targetShelfCode + " already contains a different product.");
    }

    if (context.isUpdateOperation()) {
      OrderItem existingOrderItem = context.getOrderItemResult();
      // Hoàn trả số lượng kệ cũ nếu cần thiết
      // (Logic này cần chi tiết hóa dựa trên cách bạn muốn xử lý thay đổi kệ khi
      // update)
      // Ví dụ: Nếu shelf code thay đổi, kệ cũ cần được cập nhật
    }

    if (shelf.getQuantity() < quantityToProcess && !context.isUpdateOperation()) {
      throw new Exception("Not enough quantity on shelf " + targetShelfCode);
    }
    // Nếu là update, số lượng trên kệ = số lượng hiện tại + số lượng cũ của
    // orderItem - số lượng mới
    if (context.isUpdateOperation()) {
      OrderItem existingOi = context.getOrderItemResult(); // OrderItem trước khi update
      shelf.setQuantity(shelf.getQuantity() + existingOi.getQuantity() - quantityToProcess);
    } else { // Nếu là create
      shelf.setQuantity(shelf.getQuantity() - quantityToProcess);
    }

    if (shelf.getQuantity() < 0) {
      throw new Exception("Shelf quantity cannot be negative for shelf " + targetShelfCode);
    }
    if (shelf.getQuantity() == 0 && !context.isUpdateOperation()) { // Nếu kệ hết sạch sau khi tạo (không phải update)
      // Cân nhắc việc xóa productId khỏi kệ hoặc xóa hẳn kệ nếu nghiệp vụ cho phép
      // shelf.setProductId(null); // Nếu muốn giữ kệ lại nhưng đánh dấu trống
      shelfRepository.deleteById(shelf.getId()); // Nếu muốn xóa kệ khi trống
    } else {
      shelf.setProductId(product.getId()); // Gán productId cho kệ nếu chưa có hoặc khớp
      shelfRepository.save(shelf);
      shelvesUpdated.add(shelf);
    }

    // Cập nhật Inventory quantity
    Optional<Inventory> inventoryOpt = inventoryRepository.findById(shelf.getInventoryid());
    if (inventoryOpt.isPresent()) {
      Inventory inventory = inventoryOpt.get();
      // Tính toán lại tổng số lượng trong inventory dựa trên tất cả các kệ của nó
      int totalInventoryQuantity = 0;
      List<Shelf> shelvesInInventory = shelfRepository.findByinventoryid(inventory.getId());
      for (Shelf s : shelvesInInventory) {
        totalInventoryQuantity += s.getQuantity();
      }
      inventory.setQuantity(totalInventoryQuantity);
      inventoryRepository.save(inventory);
      context.setInventoryOptional(Optional.of(inventory));
    }

    if (nextHandler != null) {
      nextHandler.process(context);
    }
  }
}