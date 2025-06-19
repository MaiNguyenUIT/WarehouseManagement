package com.example.backend.serviceImpl;

import com.example.backend.model.OrderItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.ENUM.ORDER_ITEM_STATE;
import com.example.backend.pattern.IteratorPattern.OrderItemCollection;
import com.example.backend.pattern.IteratorPattern.OrderItemIterator;
import com.example.backend.pattern.IteratorPattern.OrderItemList;
import com.example.backend.pattern.IteratorPattern.Iterator;
import com.example.backend.serviceImpl.orderitem.template.StandardOrderItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;
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
        orderItem.setOrderItem_id(id);
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

//    @Override
//    public List<String> getAllOrderItemCode() {
//        List<OrderItem> orderItems = orderItemRepository.findAll();
//        return orderItems.stream()
//                .map(OrderItem::getOrderItemCode)
//                .filter(code -> code != null && !code.trim().isEmpty())
//                .distinct()
//                .collect(Collectors.toList());
//    }

    @Override
    public OrderItem getOrderByOrderItemCode(String orderItemCode) {
        if (orderItemCode == null || orderItemCode.trim().isEmpty()) {
            return null;
        }

        return orderItemRepository.findByorderItemCode(orderItemCode.trim());
    }

    @Override
    public List<String> getAllOrderItemCode() {
        List<OrderItem> orderItems = orderItemRepository.findAll();
        OrderItemCollection collection = new OrderItemList(orderItems);
        Iterator<OrderItem> iterator = collection.createIterator();

        Set<String> uniqueCodes = new HashSet<>();

        while (iterator.hasNext()) {
            OrderItem item = iterator.next();
            String code = item.getOrderItemCode();
            if (code != null && !code.trim().isEmpty()) {
                uniqueCodes.add(code.trim());
            }
        }

        return new ArrayList<>(uniqueCodes);
    }
}