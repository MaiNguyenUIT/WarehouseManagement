package com.example.backend.serviceImpl;

import com.example.backend.model.OrderItem;
import com.example.backend.repository.InventoryRepository;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ShelfRepository;
import com.example.backend.serviceImpl.orderitem.OrderItemProcessingContext;
import com.example.backend.serviceImpl.orderitem.handler.*;
import com.example.backend.pattern.IteratorPattern.OrderItemCollection;
import com.example.backend.pattern.IteratorPattern.OrderItemFilter;
import com.example.backend.pattern.IteratorPattern.OrderItemIterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService implements com.example.backend.service.OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final ShelfRepository shelfRepository;
    private final InventoryRepository inventoryRepository;

    // Handlers for Chain of Responsibility
    private final OrderItemCodeExistenceHandler orderItemCodeExistenceHandler;
    private final ProductValidationHandler productValidationHandler;
    private final PriceCalculationHandler priceCalculationHandler;
    private final InventoryUpdateHandler inventoryUpdateHandler; // Dùng cho create/update
    private final OrderItemSetupHandler orderItemSetupHandler;
    private final OrderItemPersistenceHandler orderItemPersistenceHandler;

    // Handlers for Deletion
    private final OrderItemFetchHandler orderItemFetchHandler;
    private final InventoryReversalHandler inventoryReversalHandler; // Dùng cho delete
    private final OrderItemDeletionHandler orderItemDeletionHandler;

    private OrderItemProcessingHandler chainHeadForCreate;
    private OrderItemProcessingHandler chainHeadForUpdate;
    private OrderItemProcessingHandler chainHeadForDelete;

    @Autowired
    public OrderItemService(OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            ShelfRepository shelfRepository,
            InventoryRepository inventoryRepository,
            // Create/Update Handlers
            OrderItemCodeExistenceHandler oiceHandler,
            ProductValidationHandler pvHandler,
            PriceCalculationHandler pcHandler,
            InventoryUpdateHandler iuHandler,
            OrderItemSetupHandler oisHandler,
            OrderItemPersistenceHandler oipHandler,
            // Delete Handlers
            OrderItemFetchHandler oifHandler,
            InventoryReversalHandler irHandler,
            OrderItemDeletionHandler oidHandler) {
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.shelfRepository = shelfRepository;
        this.inventoryRepository = inventoryRepository;

        // Inject create/update handlers
        this.orderItemCodeExistenceHandler = oiceHandler;
        this.productValidationHandler = pvHandler;
        this.priceCalculationHandler = pcHandler;
        this.inventoryUpdateHandler = iuHandler;
        this.orderItemSetupHandler = oisHandler;
        this.orderItemPersistenceHandler = oipHandler;

        // Inject delete handlers
        this.orderItemFetchHandler = oifHandler;
        this.inventoryReversalHandler = irHandler;
        this.orderItemDeletionHandler = oidHandler;

        buildChains();
    }

    private void buildChains() {
        // Build chain for CREATE operation
        orderItemCodeExistenceHandler.setNextHandler(productValidationHandler);
        productValidationHandler.setNextHandler(priceCalculationHandler);
        priceCalculationHandler.setNextHandler(inventoryUpdateHandler); // Sử dụng InventoryUpdateHandler
        inventoryUpdateHandler.setNextHandler(orderItemSetupHandler);
        orderItemSetupHandler.setNextHandler(orderItemPersistenceHandler);
        chainHeadForCreate = orderItemCodeExistenceHandler;

        // Build chain for UPDATE operation
        ProductValidationHandler updateProductValidationHandler = new ProductValidationHandler(productRepository);
        PriceCalculationHandler updatePriceCalculationHandler = new PriceCalculationHandler();
        // InventoryUpdateHandler cho update có thể cần logic phức tạp hơn để xử lý hoàn
        // trả số lượng cũ
        // Sử dụng cùng instance inventoryUpdateHandler và nó sẽ kiểm tra
        // context.isUpdateOperation()
        OrderItemSetupHandler updateOrderItemSetupHandler = new OrderItemSetupHandler();
        OrderItemPersistenceHandler updateOrderItemPersistenceHandler = new OrderItemPersistenceHandler(
                orderItemRepository);

        updateProductValidationHandler.setNextHandler(updatePriceCalculationHandler);
        updatePriceCalculationHandler.setNextHandler(inventoryUpdateHandler); // Sử dụng lại instance này
        inventoryUpdateHandler.setNextHandler(updateOrderItemSetupHandler);
        updateOrderItemSetupHandler.setNextHandler(updateOrderItemPersistenceHandler);
        chainHeadForUpdate = updateProductValidationHandler;

        // Build chain for DELETE operation
        orderItemFetchHandler.setNextHandler(inventoryReversalHandler);
        inventoryReversalHandler.setNextHandler(orderItemDeletionHandler);
        // orderItemDeletionHandler.setNextHandler(null); // Handler cuối cùng
        chainHeadForDelete = orderItemFetchHandler;
    }

    @Override
    @Transactional
    public OrderItem createOrderItem(OrderItem orderItemInput) throws Exception {
        OrderItemProcessingContext context = new OrderItemProcessingContext(orderItemInput, false);
        chainHeadForCreate.process(context);
        return context.getOrderItemResult();
    }

    @Override
    @Transactional
    public OrderItem updateOrderItem(OrderItem orderItemInput, String id) throws Exception {
        OrderItem existingOrderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new Exception("OrderItem not found with id: " + id + " for update."));

        if (!existingOrderItem.getOrderItemCode().equals(orderItemInput.getOrderItemCode())) {
            OrderItem existOrderItemCode = orderItemRepository.findByorderItemCode(orderItemInput.getOrderItemCode());
            if (existOrderItemCode != null && !existOrderItemCode.getOrderItem_id().equals(id)) {
                throw new Exception(
                        "New OrderItem code '" + orderItemInput.getOrderItemCode() + "' is already in use.");
            }
        }

        OrderItemProcessingContext context = new OrderItemProcessingContext(orderItemInput, existingOrderItem, true);
        chainHeadForUpdate.process(context);
        return context.getOrderItemResult();
    }

    @Override
    @Transactional
    public void deleteOrderItem(String id) throws Exception {
        // Tạo một đối tượng OrderItem giả để truyền ID vào context,
        // OrderItemFetchHandler sẽ fetch đối tượng đầy đủ.
        OrderItem placeholderOrderItemWithId = new OrderItem();
        placeholderOrderItemWithId.setOrderItem_id(id);

        OrderItemProcessingContext context = new OrderItemProcessingContext(placeholderOrderItemWithId, true);
        context.setOrderItemResult(null); // Để OrderItemFetchHandler biết cần phải fetch

        chainHeadForDelete.process(context);
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