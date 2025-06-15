package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.User;
import com.example.backend.request.OrderItemRequest;
import com.example.backend.request.OrderStateRequest;
import com.example.backend.request.OrderStatusRequest;
import com.example.backend.respone.ApiOrderRespone;
import com.example.backend.service.OrderService;
import com.example.backend.service.ProductService;
import com.example.backend.serviceImpl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order")
public class OrderController {
    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private ProductService productService;

    @PostMapping("")
    public ResponseEntity<ApiOrderRespone> createOrder(@RequestHeader("Authorization") String jwt,
            @RequestBody OrderItemRequest order) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        ApiOrderRespone apiOrderRespone = new ApiOrderRespone();
        Order order1 = orderService.createOrder(order, jwt);
        apiOrderRespone.setData(order1);
        apiOrderRespone.setMessage(user.getUserName() + " tạo đơn hàng " + order1.getOrderCode());
        return new ResponseEntity<>(apiOrderRespone, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Order>> getOrder(@RequestHeader("Authorization") String jwt, @PathVariable String id)
            throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderService.getOrderById(id), HttpStatus.CREATED);
    }

    @PutMapping("/updateOrder/{id}")
    public ResponseEntity<ApiOrderRespone> updateOrder(@RequestHeader("Authorization") String jwt,
            @PathVariable String id, @RequestBody OrderItemRequest order) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        ApiOrderRespone apiOrderRespone = new ApiOrderRespone();
        Order order1 = orderService.updateOrder(order, id);
        apiOrderRespone.setData(order1);
        apiOrderRespone.setMessage(user.getUserName() + " cập nhật đơn hàng " + order1.getOrderCode());
        return new ResponseEntity<>(apiOrderRespone, HttpStatus.OK);
    }

    @GetMapping("/getOrder")
    public ResponseEntity<List<Order>> getOrderByUserId(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderService.getOrderByUserId(user.getId()), HttpStatus.OK);
    }

    @GetMapping("/getOrderByState")
    public ResponseEntity<List<Order>> getOrderByState(@RequestHeader("Authorization") String jwt,
            OrderStateRequest orderStateRequest) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderService.getOrderByState(orderStateRequest.getState()), HttpStatus.OK);
    }

    @GetMapping("/getOrderByStatus")
    public ResponseEntity<List<Order>> getOrderByStatus(@RequestHeader("Authorization") String jwt,
            OrderStatusRequest orderStatusRequest) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderService.getOrderByStatus(orderStatusRequest.getOrderStatus()), HttpStatus.OK);
    }

    @GetMapping("/getOrderByOrderCode/{orderCode}")
    public ResponseEntity<ApiOrderRespone> getOrderByOrderCode(@RequestHeader("Authorization") String jwt,
            @PathVariable String orderCode) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        ApiOrderRespone apiOrderRespone = new ApiOrderRespone();
        apiOrderRespone.setData(orderService.getOrderByOrderCode(orderCode));
        apiOrderRespone.setMessage("Lấy order bằng order code thành công");
        return new ResponseEntity<>(apiOrderRespone, HttpStatus.OK);
    }

}
