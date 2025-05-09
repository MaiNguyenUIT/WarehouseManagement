package com.example.backend.serviceImpl;

import com.example.backend.ENUM.ORDER_ITEM_STATE;
import com.example.backend.ENUM.PRODUCT_STATUS;
import com.example.backend.model.*;
import com.example.backend.repository.InventoryRepository;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ShelfRepository;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.pattern.IteratorPattern.OrderItemIterator;
import com.example.backend.pattern.IteratorPattern.OrderItemCollection;
import com.example.backend.pattern.IteratorPattern.OrderItemFilter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService implements com.example.backend.service.OrderItemService {
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShelfRepository shelfRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public OrderItem createOrderItem(OrderItem orderItem) throws Exception {
        OrderItem existOrderItemCode = orderItemRepository.findByorderItemCode(orderItem.getOrderItemCode());
        if(existOrderItemCode != null){
            throw new Exception("OrderItem code is already exist");
        }

        Optional<Product> existProduct = productService.getProductById(orderItem.getProduct_id());
        if(existProduct.isEmpty()){
            throw new Exception("Product not found");
        }

        if(existProduct.get().getInventory_quantity() < orderItem.getQuantity()){
            throw new Exception("Product quantity in inventory is not enough");
        }

        OrderItem newOrderItem = new OrderItem();
        newOrderItem.setQuantity(orderItem.getQuantity());
        newOrderItem.setProduct_id(orderItem.getProduct_id());
        newOrderItem.setOrderItemCode(orderItem.getOrderItemCode());
        newOrderItem.setShelfCode(orderItem.getShelfCode());

        int totalPrice = orderItem.getQuantity()*existProduct.get().getPrice();
        Optional<Inventory> inventory = inventoryRepository.findById(shelfRepository.findByshelfCode(orderItem.getShelfCode().get(0)).getInventoryid());
        //check if product quantity in inventory equal with orderItem
        if(existProduct.get().getInventory_quantity() == orderItem.getQuantity()){
            existProduct.get().setInventory_quantity(0);
            existProduct.get().setProductStatus(PRODUCT_STATUS.OUT_STOCK);
            int quantity = orderItem.getQuantity();

            //update shelf quantity
            for(String shelfCode : orderItem.getShelfCode()){
                Shelf shelf = shelfRepository.findByshelfCode(shelfCode);
                if(quantity >= shelf.getQuantity()){
                    quantity -= shelf.getQuantity();
                    shelfRepository.deleteById(shelf.getId());
                }

                if(quantity < shelf.getQuantity()){
                    shelf.setQuantity(shelf.getQuantity() - quantity);
                    quantity = 0;
                    shelfRepository.save(shelf);
                }
            }

            int totalQuantity = 0;
            for (Shelf shelf : shelfRepository.findByinventoryid(inventory.get().getId())){
                totalQuantity += shelf.getQuantity();
            }
            inventory.get().setQuantity(totalQuantity);
            inventoryRepository.save(inventory.get());
            productRepository.save(existProduct.get());

        } else {
            existProduct.get().setInventory_quantity(existProduct.get().getInventory_quantity() - orderItem.getQuantity());
            int quantity = orderItem.getQuantity();
            for(String shelfCode : orderItem.getShelfCode()){
                Shelf shelf = shelfRepository.findByshelfCode(shelfCode);
                if(quantity >= shelf.getQuantity()){
                    quantity -= shelf.getQuantity();
                    shelf.setQuantity(0);
                    shelf.setProductId(null);
                    shelfRepository.deleteById(shelf.getId());
                }

                if(quantity < shelf.getQuantity()){
                    shelf.setQuantity(shelf.getQuantity() - quantity);
                    quantity = 0;
                    shelfRepository.save(shelf);
                }
            }

            int totalQuantity = 0;
            for (Shelf shelf : shelfRepository.findByinventoryid(inventory.get().getId())){
                totalQuantity += shelf.getQuantity();
            }
            inventory.get().setQuantity(totalQuantity);
            inventoryRepository.save(inventory.get());
            productRepository.save(existProduct.get());
        }
        newOrderItem.setTotalPrice(totalPrice);
        return orderItemRepository.save(newOrderItem);
    }

    @Override
    public OrderItem updateOrderItem(OrderItem orderItem, String id) throws Exception {
        OrderItem existOrderItem = orderItemRepository.findById(id).orElse(null);
        if(existOrderItem == null){
            throw new Exception("OrderItem not found");
        }

        Optional<Product> existProduct = productService.getProductById(orderItem.getProduct_id());
        if(existProduct.isEmpty()){
            throw new Exception("Product not found");
        }

        if(existProduct.get().getInventory_quantity() < orderItem.getQuantity()){
            throw new Exception("Product quantity in inventory is not enough");
        }

        existOrderItem.setQuantity(orderItem.getQuantity());
        int totalPrice = orderItem.getQuantity()*existProduct.get().getPrice();
        Optional<Inventory> inventory = inventoryRepository.findById(shelfRepository.findByshelfCode(orderItem.getShelfCode().get(0)).getInventoryid());
        //check if product quantity in inventory equal with orderItem
        if(existProduct.get().getInventory_quantity() == orderItem.getQuantity()){
            existProduct.get().setInventory_quantity(0);
            existProduct.get().setProductStatus(PRODUCT_STATUS.OUT_STOCK);
            int quantity = orderItem.getQuantity();
            for(String shelfCode : orderItem.getShelfCode()){
                Shelf shelf = shelfRepository.findByshelfCode(shelfCode);
                if(quantity > shelf.getQuantity()){
                    quantity -= shelf.getQuantity();
                    shelf.setQuantity(0);
                    shelfRepository.save(shelf);
                    shelfRepository.deleteById(shelf.getId());
                }

                if(quantity <= shelf.getQuantity()){
                    shelf.setQuantity(shelf.getQuantity() - quantity);
                    quantity = 0;
                    shelfRepository.save(shelf);
                }
            }

            int totalQuantity = 0;
            for (Shelf shelf : shelfRepository.findByinventoryid(inventory.get().getId())){
                totalQuantity += shelf.getQuantity();
            }
            inventory.get().setQuantity(totalQuantity);
            inventoryRepository.save(inventory.get());
            productRepository.save(existProduct.get());
            productRepository.save(existProduct.get());

        } else {
            existProduct.get().setInventory_quantity(existProduct.get().getInventory_quantity() - orderItem.getQuantity());
            int quantity = orderItem.getQuantity();
            for(String shelfCode : orderItem.getShelfCode()){
                Shelf shelf = shelfRepository.findByshelfCode(shelfCode);
                if(quantity > shelf.getQuantity()){
                    quantity -= shelf.getQuantity();
                    shelf.setQuantity(0);
                    shelfRepository.save(shelf);
                    shelfRepository.deleteById(shelf.getId());
                }

                if(quantity <= shelf.getQuantity()){
                    shelf.setQuantity(shelf.getQuantity() - quantity);
                    quantity = 0;
                    shelfRepository.save(shelf);
                }
            }
            int totalQuantity = 0;
            for (Shelf shelf : shelfRepository.findByinventoryid(inventory.get().getId())){
                totalQuantity += shelf.getQuantity();
            }
            inventory.get().setQuantity(totalQuantity);
            inventoryRepository.save(inventory.get());
            productRepository.save(existProduct.get());
            productService.updateProduct(existProduct.get().getId(), existProduct.get());
        }
        existOrderItem.setTotalPrice(totalPrice);
        return orderItemRepository.save(existOrderItem);
    }

    @Override
    public void deleteOrderItem(String id) {
        orderItemRepository.deleteById(id);
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
        List<String> codes = new ArrayList<>();
        List<OrderItem> orderItems = orderItemRepository.findAll();
        OrderItemCollection collection = new OrderItemCollection(orderItems);
        OrderItemIterator iterator = collection.createIterator();

        while (iterator.hasNext()) {
            OrderItem item = iterator.next();
            if (OrderItemFilter.isOutOrder(item)) {
                codes.add(item.getOrderItemCode());
            }
        }

        return codes;
    }

    @Override
    public OrderItem getOrderByOrderItemCode(String orderItemCode) {
        return orderItemRepository.findByorderItemCode(orderItemCode);
    }
}
