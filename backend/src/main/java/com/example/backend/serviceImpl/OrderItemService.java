package com.example.backend.serviceImpl;

import com.example.backend.model.OrderItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import com.example.backend.serviceImpl.orderitem.template.StandardOrderItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
<<<<<<< HEAD
=======
import org.springframework.transaction.annotation.Transactional;
>>>>>>> main

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
        return orderItemProcessor.processOrderItem(orderItem, false);
    }

    @Override
    @Transactional
    public OrderItem updateOrderItem(OrderItem orderItem, String id) throws Exception {
        orderItem.setOrderItem_id(id); // Đảm bảo ID được set
        return orderItemProcessor.processOrderItem(orderItem, true);
    }

    @Override
    @Transactional
    public void deleteOrderItem(String id) throws Exception {
        orderItemProcessor.deleteOrderItem(id);
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
<<<<<<< HEAD
        List<String> orderItemCode = new ArrayList<>();
        for(OrderItem orderItem : orderItemRepository.findAll()){
            if(orderItem.getOrderItemState() == ORDER_ITEM_STATE.OUT_ORDER) {
                orderItemCode.add(orderItem.getOrderItemCode());
            }
        }
        return orderItemCode;
=======
        List<OrderItem> orderItems = orderItemRepository.findAll();
        return orderItems.stream()
                .map(OrderItem::getOrderItemCode)
                .filter(code -> code != null && !code.trim().isEmpty())
                .distinct()
                .collect(Collectors.toList());
>>>>>>> main
    }

    @Override
    public OrderItem getOrderByOrderItemCode(String orderItemCode) {
        if (orderItemCode == null || orderItemCode.trim().isEmpty()) {
            return null;
        }

        return orderItemRepository.findByorderItemCode(orderItemCode.trim());
    }
}