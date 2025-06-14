package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.OrderQuantity;
import com.example.backend.model.User;
import com.example.backend.request.OrderStateRequest;
import com.example.backend.request.OrderStatusRequest;
import com.example.backend.service.OrderService;
import com.example.backend.service.ProductService;
import com.example.backend.serviceImpl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/order")
public class AdminOrderController {
    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private ProductService productService;

    @GetMapping("")
    public ResponseEntity<List<Order>> getAllOrder(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderService.getAllOrder(), HttpStatus.OK);
    }

    @PutMapping("/updateOrderState/{id}")
    public ResponseEntity<Order> updateOrderState(@RequestHeader("Authorization") String jwt, @PathVariable String id,
            @RequestBody OrderStateRequest state) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderService.updateOrderState(state, id), HttpStatus.OK);
    }

    @DeleteMapping("/deleteOrder/{id}")
    public ResponseEntity<Void> deleteOrder(@RequestHeader("Authorization") String jwt, @PathVariable String id)
            throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        orderService.deleteOrder(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getOrderQuantity")
    public ResponseEntity<OrderQuantity> getOrderQuantity(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderService.getOrderQuantity(), HttpStatus.OK);
    }

    @PutMapping("/updateOrderStatus/{id}")
    public ResponseEntity<Order> updateOrderStatus(@RequestHeader("Authorization") String jwt, @PathVariable String id,
            @RequestBody OrderStatusRequest status) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderService.updateOrderStatus(status, id), HttpStatus.OK);
    }

    @GetMapping("/by-month")
    public ResponseEntity<OrderQuantity> getOrderQuantityByMonth(@RequestHeader("Authorization") String jwt,
            @RequestParam("month") int month,
            @RequestParam("year") int year) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(orderService.getOrderQuantityByMonth(month, year), HttpStatus.OK);
    }
}
