package com.example.backend.pattern.IteratorPattern;

import com.example.backend.ENUM.ORDER_ITEM_STATE;
import com.example.backend.model.OrderItem;

public class OrderItemFilter {
    public static boolean isOutOrder(OrderItem item) {
        return item.getOrderItemState() == ORDER_ITEM_STATE.OUT_ORDER;
    }
}
