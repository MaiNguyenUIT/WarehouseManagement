package com.example.backend.serviceImpl;

import com.example.backend.model.OrderItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import com.example.backend.serviceImpl.orderitem.template.StandardOrderItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderItemService implements com.example.backend.service.OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final StandardOrderItemProcessor orderItemProcessor;

    @Autowired
    public OrderItemService(OrderItemRepository orderItemRepository,
            StandardOrderItemProcessor orderItemProcessor) {
        this.orderItemRepository = orderItemRepository;
        this.orderItemProcessor = orderItemProcessor;
    }

    @Override
    @Transactional
    public OrderItem createOrderItem(OrderItem orderItem) throws Exception {
        OrderItemProcessingContext context = new OrderItemProcessingContext(orderItem, false);
        return orderItemProcessor.processOrderItem(context);
    }

    @Override
    @Transactional
    public OrderItem updateOrderItem(OrderItem orderItem, String id) throws Exception {
        Optional<OrderItem> existingOrderItemOpt = orderItemRepository.findById(id);
        if (existingOrderItemOpt.isEmpty()) {
            throw new Exception("OrderItem not found with id: " + id);
        }

        OrderItem existingOrderItem = existingOrderItemOpt.get();
        orderItem.setOrderItem_id(id); // Đảm bảo ID được set

        OrderItemProcessingContext context = new OrderItemProcessingContext(orderItem, existingOrderItem, true);
        return orderItemProcessor.processOrderItem(context);
    }

    @Override
    @Transactional
    public void deleteOrderItem(String id) throws Exception {
        OrderItem placeholderOrderItemWithId = new OrderItem();
        placeholderOrderItemWithId.setOrderItem_id(id);

        OrderItemProcessingContext context = new OrderItemProcessingContext(placeholderOrderItemWithId, true);
        context.setOrderItemResult(null); // Để fetch handler biết cần phải fetch

        orderItemProcessor.deleteOrderItem(context);
    }

    @Override
    public Optional<OrderItem> getOrderItemById(String id) {
        return orderItemRepository.findById(id);
    }

    @Override
    public List<OrderItem> getAllOrderItem() {
        return orderItemRepository.findAll();
    }

    @Override
    public List<String> getAllOrderItemCode() {
        List<OrderItem> orderItems = orderItemRepository.findAll();
        return orderItems.stream()
                .map(OrderItem::getOrderItemCode)
                .filter(code -> code != null && !code.trim().isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public OrderItem getOrderByOrderItemCode(String orderItemCode) {
        if (orderItemCode == null || orderItemCode.trim().isEmpty()) {
            return null;
        }

        return orderItemRepository.findByorderItemCode(orderItemCode.trim());
    }
}