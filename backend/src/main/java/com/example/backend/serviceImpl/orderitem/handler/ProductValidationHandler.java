package com.example.backend.serviceImpl.orderitem.handler;

import com.example.backend.model.Product;
import com.example.backend.repository.ProductRepository;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class ProductValidationHandler implements OrderItemProcessingHandler {
  private OrderItemProcessingHandler nextHandler;
  private final ProductRepository productRepository; // Sử dụng trực tiếp ProductRepository

  @Autowired
  public ProductValidationHandler(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @Override
  public void setNextHandler(OrderItemProcessingHandler nextHandler) {
    this.nextHandler = nextHandler;
  }

  @Override
  public void process(OrderItemProcessingContext context) throws Exception {
    Optional<Product> productOpt = productRepository.findById(context.getOrderItemInput().getProduct_id());
    if (productOpt.isEmpty()) {
      throw new Exception("Product not found");
    }
    Product product = productOpt.get();
    if (product.getInventory_quantity() < context.getOrderItemInput().getQuantity()) {
      throw new Exception("Product quantity in inventory is not enough");
    }
    context.setProductOptional(productOpt); // Lưu product vào context cho handler sau

    if (nextHandler != null) {
      nextHandler.process(context);
    }
  }
}