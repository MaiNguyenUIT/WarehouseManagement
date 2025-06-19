package com.example.backend.serviceImpl;

import com.example.backend.ENUM.ORDER_ITEM_STATE;
import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.ENUM.ORDER_STATUS;
import com.example.backend.model.Order;
import com.example.backend.model.OrderItem;
import com.example.backend.model.OrderQuantity;
import com.example.backend.model.User;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.request.OrderItemRequest;
import com.example.backend.request.OrderStateRequest;
import com.example.backend.request.OrderStatusRequest;
import com.example.backend.service.UserService;
import com.example.backend.state.OrderStateFactory;
import com.example.backend.pattern.IteratorPattern.Iterator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService implements com.example.backend.service.OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderItemService orderItemService;

    private Order initializeOrderState(Order order) {
        if (order != null) {
            order.getCurrentState();
        }
        return order;
    }

    private List<Order> initializeOrderStates(List<Order> orders) {
        orders.forEach(this::initializeOrderState);
        return orders;
    }

    @Override
    @Transactional
    public Order createOrder(OrderItemRequest orderRequest, String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (orderRepository.existsByOrderCode(orderRequest.getOrderCode())) {
            throw new Exception("Order code is already used");
        }

        Order newOrder = new Order();
        newOrder.setCreated_at(LocalDate.now());
        newOrder.setDelivery_Address(orderRequest.getDelivery_Address());
        newOrder.setOrderItem_code(orderRequest.getOrderItem_code());
        newOrder.setUserId(user.getId());
        newOrder.setOrderItem_quantity(orderRequest.getOrderItem_code().size());
        newOrder.setOrderCode(orderRequest.getOrderCode());
        newOrder.setOrderStatus(ORDER_STATUS.OUT_EXPORT);

        newOrder.setCurrentState(OrderStateFactory.getState(ORDER_STATE.PENDING));

        int totalPrice = 0;
        for (String orderItemCode : orderRequest.getOrderItem_code()) {
            OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
            if (orderItem == null) {
                throw new Exception("OrderItem with code " + orderItemCode + " not found.");
            }

            totalPrice += orderItem.getTotalPrice();

            if (orderItem.getOrderItemState() != ORDER_ITEM_STATE.IN_ORDER) {
                orderItem.setOrderItemState(ORDER_ITEM_STATE.IN_ORDER);
                orderItemRepository.save(orderItem);
            }
        }
        newOrder.setOrderPrice(totalPrice);

        return orderRepository.save(newOrder);
    }

    @Override
    @Transactional
    public Order updateOrder(OrderItemRequest orderRequest, String orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId)
                .map(this::initializeOrderState)
                .orElseThrow(() -> new Exception("Order not found with id: " + orderId));

        existingOrder.updateOrderDetails(orderRequest, orderItemRepository);

        return orderRepository.save(existingOrder);
    }

    @Override
    public List<Order> getAllOrder() {
        return initializeOrderStates(orderRepository.findAll());
    }

    @Override
    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id).map(this::initializeOrderState);
    }

    @Override
    @Transactional
    public void deleteOrder(String id) throws Exception {
        Order order = orderRepository.findById(id)
                .map(this::initializeOrderState)
                .orElseThrow(() -> new Exception("Order not found with id: " + id));

        if (order.getOrderStatus() == ORDER_STATUS.IN_EXPORT) {
            throw new Exception("Order is already in export so that cannot delete");
        }

        ORDER_STATE currentOrderState = order.getOrderState();
        if (currentOrderState == ORDER_STATE.DELIVERED || currentOrderState == ORDER_STATE.ON_GOING) {
            throw new Exception("Cannot delete an order that is " + currentOrderState);
        }

        if (currentOrderState != ORDER_STATE.CANCELLED) {
            for (String i : order.getOrderItem_code()) {
                OrderItem item = orderItemRepository.findByorderItemCode(i);
                if (item != null && item.getOrderItemState() == ORDER_ITEM_STATE.IN_ORDER) {
                    item.setOrderItemState(ORDER_ITEM_STATE.OUT_ORDER);
                    orderItemRepository.save(item);
                }
            }
        }

        orderRepository.deleteById(id);
    }

    @Override
    public List<Order> getOrderByUserId(String userId) {
        return initializeOrderStates(orderRepository.findByUserId(userId));
    }

    @Override
    @Transactional
    public Order updateOrderState(OrderStateRequest stateRequest, String orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId)
                .map(this::initializeOrderState)
                .orElseThrow(() -> new Exception("Order not found with id: " + orderId));

        ORDER_STATE targetOrderState = stateRequest.getState();

        switch (targetOrderState) {
            case CONFIRMED:
                existingOrder.confirmOrder();
                break;
            case ON_GOING:
                existingOrder.shipOrder();
                break;
            case DELIVERED:
                existingOrder.deliverOrder();
                break;
            case CANCELLED:
                existingOrder.cancelOrder(orderItemRepository);
                break;
            case PENDING:
                throw new Exception("Cannot manually revert state to PENDING.");
            default:
                throw new Exception("Unsupported target state: " + targetOrderState);
        }

        return orderRepository.save(existingOrder);
    }

    @Override
    public List<Order> getOrderByState(ORDER_STATE orderState) {
        return initializeOrderStates(orderRepository.findByOrderState(orderState));
    }

    @Override
    public List<Order> getOrderByStatus(ORDER_STATUS orderStatus) {
        return initializeOrderStates(orderRepository.findByOrderStatus(orderStatus));
    }

    @Override
    public OrderQuantity getOrderQuantity() {

        long on_pending = orderRepository.countByOrderState(ORDER_STATE.PENDING);
        long confirmed = orderRepository.countByOrderState(ORDER_STATE.CONFIRMED);
        long delivered = orderRepository.countByOrderState(ORDER_STATE.DELIVERED);
        long on_going = orderRepository.countByOrderState(ORDER_STATE.ON_GOING);
        long cancel = orderRepository.countByOrderState(ORDER_STATE.CANCELLED);

        OrderQuantity orderQuantity = new OrderQuantity();
        orderQuantity.setCancelQuantity((int) cancel);
        orderQuantity.setConfirmedQuantity((int) confirmed);
        orderQuantity.setPendingQuantity((int) on_pending);
        orderQuantity.setDeliveredQuantity((int) delivered);
        orderQuantity.setOnGoingQuantity((int) on_going);

        return orderQuantity;
    }

    @Override
    public Order getOrderByOrderCode(String orderCode) {
        return initializeOrderState(orderRepository.findByOrderCode(orderCode));
    }

    @Override
    @Transactional
    public Order updateOrderStatus(OrderStatusRequest status, String orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found with id: " + orderId));

        existingOrder.setOrderStatus(status.getOrderStatus());
        existingOrder.setUpdate_at(LocalDate.now());
        return orderRepository.save(existingOrder);
    }

    @Override
    public OrderQuantity getOrderQuantityByMonth(int month, int year) {

        List<Order> ordersInMonth = orderRepository.findOrdersByMonthAndYear(month, year);

        long on_pending = ordersInMonth.stream().filter(o -> o.getOrderState() == ORDER_STATE.PENDING).count();
        long confirmed = ordersInMonth.stream().filter(o -> o.getOrderState() == ORDER_STATE.CONFIRMED).count();
        long delivered = ordersInMonth.stream().filter(o -> o.getOrderState() == ORDER_STATE.DELIVERED).count();
        long on_going = ordersInMonth.stream().filter(o -> o.getOrderState() == ORDER_STATE.ON_GOING).count();
        long cancel = ordersInMonth.stream().filter(o -> o.getOrderState() == ORDER_STATE.CANCELLED).count();

        OrderQuantity orderQuantity = new OrderQuantity();
        orderQuantity.setCancelQuantity((int) cancel);
        orderQuantity.setConfirmedQuantity((int) confirmed);
        orderQuantity.setPendingQuantity((int) on_pending);
        orderQuantity.setDeliveredQuantity((int) delivered);
        orderQuantity.setOnGoingQuantity((int) on_going);

        return orderQuantity;
    }

    public void printOrderItemsUsingIterator(String orderId) throws Exception {
        Order order = getOrderById(orderId).orElseThrow(() -> new Exception("Order not found"));
        List<OrderItem> items = order.getOrderItem_code().stream()
                .map(orderItemService::getOrderByOrderItemCode)
                .filter(java.util.Objects::nonNull)
                .toList();

        order.setOrderItems(items);

        Iterator<OrderItem> iterator = order.createIterator();
        while (iterator.hasNext()) {
            OrderItem item = iterator.next();
            System.out.println(item.getOrderItemCode());
        }
    }
}