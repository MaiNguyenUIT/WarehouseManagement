package com.example.backend.serviceImpl;

import com.example.backend.ENUM.ORDER_ITEM_STATE;
import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.ENUM.ORDER_STATUS;
import com.example.backend.model.*;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.request.OrderItemRequest;
import com.example.backend.request.OrderStateRequest;
import com.example.backend.request.OrderStatusRequest;
import com.example.backend.service.ProductService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService implements com.example.backend.service.OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderItemService orderItemService;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserService userService;

    @Override
    public Order createOrder(OrderItemRequest order, String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Order existingOrder = orderRepository.findByorderCode(order.getOrderCode());
        if(existingOrder != null){
            throw new Exception("Order code is already used");
        }
        Order newOrder = new Order();
        LocalDate date = LocalDate.now();
        newOrder.setCreated_at(date);
        newOrder.setDelivery_Address(order.getDelivery_Address());
        newOrder.setOrderItem_code(order.getOrderItem_code());
        newOrder.setUserId(user.getId());
        newOrder.setOrderItem_quantity(order.getOrderItem_code().size());
        int totalPrice = 0;
        for(String orderItemCode : order.getOrderItem_code()){
            OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
            totalPrice += orderItem.getTotalPrice();
            orderItem.setOrderItemState(ORDER_ITEM_STATE.IN_ORDER);
            orderItemRepository.save(orderItem);
        }
        newOrder.setOrderPrice(totalPrice);
        newOrder.setOrderCode(order.getOrderCode());
        return orderRepository.save(newOrder);
    }

    @Override
    public Order updateOrder(OrderItemRequest order, String orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId).orElse(null);
        if(existingOrder == null){
            throw new Exception("Order not found");
        }

        if(existingOrder.getOrderState() == ORDER_STATE.ON_GOING || existingOrder.getOrderState() == ORDER_STATE.DELIVERED){
            throw new Exception("Cannot update order");
        }
        Order newOrder = new Order();
        LocalDate date = LocalDate.now();
        existingOrder.setUpdate_at(date);
        existingOrder.setDelivery_Address(order.getDelivery_Address());
        existingOrder.setOrderItem_code(order.getOrderItem_code());
        existingOrder.setOrderItem_quantity(order.getOrderItem_code().size());
        int totalPrice = 0;
        for(String orderItemCode : order.getOrderItem_code()){
            OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
            totalPrice += orderItem.getTotalPrice();
            orderItem.setOrderItemState(ORDER_ITEM_STATE.IN_ORDER);
            orderItemRepository.save(orderItem);
        }
        existingOrder.setOrderPrice(totalPrice);
        return orderRepository.save(existingOrder);
    }

    @Override
    public List<Order> getAllOrder() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    @Override
    public void deleteOrder(String id) throws Exception {
        Order order = orderRepository.findById(id).orElse(null);
        if(order.getOrderStatus() == ORDER_STATUS.IN_EXPORT){
            throw new Exception("Order is already in export so that cannot delete");
        }
<<<<<<< HEAD
        for(String i : order.getOrderItem_code()){
            orderItemRepository.deleteByorderItemCode(i);
        }
=======

        // Kiểm tra trạng thái đơn hàng (ORDER_STATE) - Có thể thêm vào đây nếu muốn
        // Ví dụ: không cho xóa đơn hàng đã giao hoặc đang giao
        ORDER_STATE currentOrderState = order.getOrderState();
        if (currentOrderState == ORDER_STATE.DELIVERED || currentOrderState == ORDER_STATE.ON_GOING) {
            throw new Exception("Cannot delete an order that is " + currentOrderState);
        }

        // Nếu đơn hàng chưa bị hủy, cần cập nhật lại trạng thái OrderItem thành
        // OUT_ORDER
        if (currentOrderState != ORDER_STATE.CANCELLED) {
            for (String i : order.getOrderItem_code()) {
                OrderItem item = orderItemRepository.findByorderItemCode(i);
                if (item != null && item.getOrderItemState() == ORDER_ITEM_STATE.IN_ORDER) {
                    item.setOrderItemState(ORDER_ITEM_STATE.OUT_ORDER);
                    orderItemRepository.save(item);
                }
            }
        }

>>>>>>> main
        orderRepository.deleteById(id);
    }

    @Override
    public List<Order> getOrderByUserId(String userId) {
        return orderRepository.findByuserId(userId);
    }

    @Override
<<<<<<< HEAD
    public Order updateOrderState(OrderStateRequest state, String orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId).orElse(null);
        if(existingOrder == null){
            throw new Exception("Order not found");
=======
    @Transactional
    public Order updateOrderState(OrderStateRequest stateRequest, String orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId)
                .map(this::initializeOrderState) // Khởi tạo state
                .orElseThrow(() -> new Exception("Order not found with id: " + orderId));

        ORDER_STATE targetOrderState = stateRequest.getState(); // Lấy state enum từ request

        // Gọi phương thức chuyển đổi tương ứng trên đối tượng Order
        switch (targetOrderState) {
            case CONFIRMED:
                existingOrder.confirmOrder();
                break;
            case ON_GOING:
                // Thường trạng thái này được kích hoạt bởi hành động 'ship'
                existingOrder.shipOrder();
                break;
            case DELIVERED:
                // Thường trạng thái này được kích hoạt bởi hành động 'deliver'
                existingOrder.deliverOrder();
                break;
            case CANCELLED:
                // Truyền repo vào vì CancelledState cần
                existingOrder.cancelOrder(orderItemRepository);
                break;
            case PENDING:
                // Thường không có hành động trực tiếp để quay về PENDING
                throw new Exception("Cannot manually revert state to PENDING.");
            default:
                throw new Exception("Unsupported target state: " + targetOrderState);
>>>>>>> main
        }

        if(existingOrder.getOrderState() == ORDER_STATE.DELIVERED){
            throw new Exception("Cannot update order");
        }

        existingOrder.setOrderState(state.getState());
        if (state.getState() == ORDER_STATE.CANCELLED) {
            for(String orderItemCode : existingOrder.getOrderItem_code()){
                OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
                orderItem.setOrderItemState(ORDER_ITEM_STATE.OUT_ORDER);
                orderItemRepository.save(orderItem);
            }
            existingOrder.setOrderStatus(ORDER_STATUS.OUT_EXPORT);
        }
        return orderRepository.save(existingOrder);
    }



    @Override
    public List<Order> getOrderByState(ORDER_STATE orderState) {
<<<<<<< HEAD
        List<Order> orders = new ArrayList<>();
        for(Order order : orderRepository.findAll()){
            if(order.getOrderState() == orderState){
                orders.add(order);
            }
        }
        return orders;
=======
        return initializeOrderStates(orderRepository.findByOrderState(orderState));
>>>>>>> main
    }

    @Override
    public List<Order> getOrderByStatus(ORDER_STATUS orderStatus) {
        List<Order> orders = new ArrayList<>();
        for(Order order : orderRepository.findAll()){
            if(order.getOrderStatus() == orderStatus){
                orders.add(order);
            }
        }
        return orders;
    }

    @Override
    public OrderQuantity getOrderQuantity() {
<<<<<<< HEAD
        int on_pending = 0;
        int confirmed = 0;
        int delivered = 0;
        int on_going = 0;
        int cancel = 0;
=======

        long on_pending = orderRepository.countByOrderState(ORDER_STATE.PENDING);
        long confirmed = orderRepository.countByOrderState(ORDER_STATE.CONFIRMED);
        long delivered = orderRepository.countByOrderState(ORDER_STATE.DELIVERED);
        long on_going = orderRepository.countByOrderState(ORDER_STATE.ON_GOING);
        long cancel = orderRepository.countByOrderState(ORDER_STATE.CANCELLED);

>>>>>>> main
        OrderQuantity orderQuantity = new OrderQuantity();
        for(Order order : orderRepository.findAll()){
            if(order.getOrderState() == ORDER_STATE.ON_GOING){
                on_going += 1;
            }
            if(order.getOrderState() == ORDER_STATE.DELIVERED){
                delivered += 1;
            }
            if(order.getOrderState() == ORDER_STATE.CANCELLED){
                cancel += 1;
            }
            if(order.getOrderState() == ORDER_STATE.PENDING){
                on_pending += 1;
            }
            if(order.getOrderState() == ORDER_STATE.CONFIRMED){
                confirmed += 1;
            }
        }
        orderQuantity.setCancelQuantity(cancel);
        orderQuantity.setConfirmedQuantity(confirmed);
        orderQuantity.setPendingQuantity(on_pending);
        orderQuantity.setDeliveredQuantity(delivered);
        orderQuantity.setOnGoingQuantity(on_going);

        return orderQuantity;
    }

    @Override
    public Order getOrderByOrderCode(String orderCode) {
        return orderRepository.findByorderCode(orderCode);
    }

    @Override
    public Order updateOrderStatus(OrderStatusRequest status, String orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId).orElse(null);
        if(existingOrder == null){
            throw new Exception("Order not found");
        }
        existingOrder.setOrderStatus(status.getOrderStatus());
        return orderRepository.save(existingOrder);
    }

    @Override
    public OrderQuantity getOrderQuantityByMonth(int month, int year) {
<<<<<<< HEAD
        int on_pending = 0;
        int confirmed = 0;
        int delivered = 0;
        int on_going = 0;
        int cancel = 0;
=======

        List<Order> ordersInMonth = orderRepository.findOrdersByMonthAndYear(month, year);

        long on_pending = ordersInMonth.stream().filter(o -> o.getOrderState() == ORDER_STATE.PENDING).count();
        long confirmed = ordersInMonth.stream().filter(o -> o.getOrderState() == ORDER_STATE.CONFIRMED).count();
        long delivered = ordersInMonth.stream().filter(o -> o.getOrderState() == ORDER_STATE.DELIVERED).count();
        long on_going = ordersInMonth.stream().filter(o -> o.getOrderState() == ORDER_STATE.ON_GOING).count();
        long cancel = ordersInMonth.stream().filter(o -> o.getOrderState() == ORDER_STATE.CANCELLED).count();

>>>>>>> main
        OrderQuantity orderQuantity = new OrderQuantity();
        for(Order order : orderRepository.findOrdersByMonthAndYear(month, year)){
            if(order.getOrderState() == ORDER_STATE.ON_GOING){
                on_going += 1;
            }
            if(order.getOrderState() == ORDER_STATE.DELIVERED){
                delivered += 1;
            }
            if(order.getOrderState() == ORDER_STATE.CANCELLED){
                cancel += 1;
            }
            if(order.getOrderState() == ORDER_STATE.PENDING){
                on_pending += 1;
            }
            if(order.getOrderState() == ORDER_STATE.CONFIRMED){
                confirmed += 1;
            }
        }
        orderQuantity.setCancelQuantity(cancel);
        orderQuantity.setConfirmedQuantity(confirmed);
        orderQuantity.setPendingQuantity(on_pending);
        orderQuantity.setDeliveredQuantity(delivered);
        orderQuantity.setOnGoingQuantity(on_going);

        return orderQuantity;
    }
}
