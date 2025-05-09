package com.example.backend.Decorator;

import com.example.backend.model.ImportShipment;
import com.example.backend.model.ImportShipmentItem;
import com.example.backend.service.ImportShipmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class LoggingAndValidatingImportShipmentServiceDecorator implements ImportShipmentService {
    private final ImportShipmentService delegate;
    private final Logger logger = LoggerFactory.getLogger(LoggingAndValidatingImportShipmentServiceDecorator.class);

    public LoggingAndValidatingImportShipmentServiceDecorator(ImportShipmentService delegate) {
        this.delegate = delegate;
    }

    @Override
    public ImportShipment createImportShipment(ImportShipment importShipment) {
        validateSupplier(importShipment.getSuppiler());
        logger.info("Creating import shipment with supplier: {}", importShipment.getSuppiler());
        ImportShipment result = delegate.createImportShipment(importShipment);
        logger.info("Created import shipment with ID: {}", result.getId());
        return result;
    }

    @Override
    public ImportShipment updateImportShipment(String id, ImportShipment updatedShipment) {
        validateSupplier(updatedShipment.getSuppiler());
        logger.info("Updating import shipment with ID: {}", id);
        ImportShipment result = delegate.updateImportShipment(id, updatedShipment);
        logger.info("Updated import shipment with ID: {}", result.getId());
        return result;
    }

    @Override
    public ImportShipment getImportShipmentById(String id) {
        logger.info("Retrieving import shipment with ID: {}", id);
        ImportShipment result = delegate.getImportShipmentById(id);
        logger.info("Retrieved import shipment: {}", result != null ? result.getId() : "null");
        return result;
    }

    @Override
    public List<ImportShipment> getAllImportShipments() {
        logger.info("Take all shipment");
        List<ImportShipment> result = delegate.getAllImportShipments();
        logger.info("Retrieved {} import shipments", result.size());
        return result;
    }

    @Override
    public List<ImportShipmentItem> getImportShipmentItemsByImportShipmentId(String importShipmentId) throws Exception {
        logger.info("Retrieving items for import shipment ID: {}", importShipmentId);
        List<ImportShipmentItem> result = delegate.getImportShipmentItemsByImportShipmentId(importShipmentId);
        logger.info("Retrieved {} items for import shipment ID: {}", result.size(), importShipmentId);
        return result;
    }

    @Override
    public void deleteImportShipment(String id) throws Exception {
        logger.info("Deleting import shipment with ID: {}", id);
        delegate.deleteImportShipment(id);
        logger.info("Deleted import shipment with ID: {}", id);
    }

    @Override
    public BigDecimal getImportShipmentTotalCost(String importShipmentId) throws Exception {
        logger.info("Calculating total cost for import shipment ID: {}", importShipmentId);
        BigDecimal result = delegate.getImportShipmentTotalCost(importShipmentId);
        logger.info("Total cost for import shipment ID {}: {}", importShipmentId, result);
        return result;
    }

    @Override
    public int getQuantityItem(String id) throws Exception {
        logger.info("Retrieving item quantity for import shipment ID: {}", id);
        int result = delegate.getQuantityItem(id);
        logger.info("Item quantity for import shipment ID {}: {}", id, result);
        return result;
    }

    @Override
    public List<ImportShipment> searchImportShipmentsBysuppiler(String supplier) {
        logger.info("Searching import shipments by supplier: {}", supplier);
        List<ImportShipment> result = delegate.searchImportShipmentsBysuppiler(supplier);
        logger.info("Found {} import shipments for supplier: {}", result.size(), supplier);
        return result;
    }

    @Override
    public List<ImportShipment> getImportShipmentsByDateRange(LocalDate startDate, LocalDate endDate) throws Exception {
        logger.info("Retrieving import shipments between {} and {}", startDate, endDate);
        List<ImportShipment> result = delegate.getImportShipmentsByDateRange(startDate, endDate);
        logger.info("Retrieved {} import shipments between {} and {}", result.size(), startDate, endDate);
        return result;
    }

    private void validateSupplier(String supplier) {
        if (supplier == null || supplier.trim().isEmpty()) {
            throw new IllegalArgumentException("Supplier cannot be null or empty.");
        }
    }

}