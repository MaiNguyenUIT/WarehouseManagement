package com.example.backend.serviceImpl.orderitem.handler;

import com.example.backend.model.Product;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class PriceCalculationHandler implements OrderItemProcessingHandler {
  private OrderItemProcessingHandler nextHandler;

  @Override
  public void setNextHandler(OrderItemProcessingHandler nextHandler) {
    this.nextHandler = nextHandler;
  }

  @Override
  public void process(OrderItemProcessingContext context) throws Exception {
    Optional<Product> productOpt = context.getProductOptional();
    if (productOpt.isEmpty()) {
      throw new Exception("Product not found in context for price calculation.");
    }
    Product product = productOpt.get();
    int quantity = context.getOrderItemInput().getQuantity();
    int totalPrice = quantity * product.getPrice();
    context.getOrderItemResult().setTotalPrice(totalPrice); // Cập nhật vào orderItemResult

    if (nextHandler != null) {
      nextHandler.process(context);
    }
  }
}