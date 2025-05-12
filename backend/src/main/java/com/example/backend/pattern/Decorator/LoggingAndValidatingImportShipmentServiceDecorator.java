package com.example.backend.pattern.Decorator;

import com.example.backend.model.ImportShipment;
import com.example.backend.service.ImportShipmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class LoggingAndValidatingImportShipmentServiceDecorator extends ImportShipmentServiceDecorator {

    private final Logger logger = LoggerFactory.getLogger(LoggingAndValidatingImportShipmentServiceDecorator.class);

    public LoggingAndValidatingImportShipmentServiceDecorator(ImportShipmentService delegate) {
        super(delegate);
    }

    @Override
    public ImportShipment createImportShipment(ImportShipment importShipment) {
        validateSupplier(importShipment.getSuppiler());
        logger.info("Creating import shipment with supplier: {}", importShipment.getSuppiler());
        ImportShipment result = super.createImportShipment(importShipment);
        logger.info("Created import shipment with ID: {}", result.getId());
        return result;
    }

    @Override
    public ImportShipment updateImportShipment(String id, ImportShipment updatedShipment) {
        validateSupplier(updatedShipment.getSuppiler());
        logger.info("Updating import shipment with ID: {}", id);
        ImportShipment result = super.updateImportShipment(id, updatedShipment);
        logger.info("Updated import shipment with ID: {}", result.getId());
        return result;
    }

    private void validateSupplier(String supplier) {
        if (supplier == null || supplier.trim().isEmpty()) {
            throw new IllegalArgumentException("Supplier cannot be null or empty.");
        }
    }
}
