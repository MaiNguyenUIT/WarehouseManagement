package com.example.backend.pattern.Decorator;

import com.example.backend.model.ImportShipment;
import com.example.backend.service.ImportShipmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CachingImportShipmentServiceDecorator extends ImportShipmentServiceDecorator {

    private final Logger logger = LoggerFactory.getLogger(CachingImportShipmentServiceDecorator.class);
    private final Map<String, ImportShipment> cache = new ConcurrentHashMap<>();

    public CachingImportShipmentServiceDecorator(ImportShipmentService delegate) {
        super(delegate);
    }

    @Override
    public ImportShipment getImportShipmentById(String id) {
        return cache.computeIfAbsent(id, key -> {
            logger.info("Fetching import shipment with ID: {} from service (cache miss)", key);
            return super.getImportShipmentById(key);
        });
    }

    @Override
    public ImportShipment createImportShipment(ImportShipment importShipment) {
        ImportShipment newShipment = super.createImportShipment(importShipment);
        if (newShipment != null && newShipment.getId() != null) {
            cache.put(newShipment.getId(), newShipment);
            logger.info("Cached new import shipment with ID: {}", newShipment.getId());
        }
        return newShipment;
    }

    @Override
    public ImportShipment updateImportShipment(String id, ImportShipment updatedShipment) {
        ImportShipment shipment = super.updateImportShipment(id, updatedShipment);
        if (shipment != null) {
            cache.put(id, shipment);
            logger.info("Updated cache for import shipment with ID: {}", id);
        }
        return shipment;
    }

    @Override
    public void deleteImportShipment(String id) throws Exception {
        super.deleteImportShipment(id);
        if (cache.containsKey(id)) {
            cache.remove(id);
            logger.info("Removed import shipment with ID: {} from cache", id);
        }
    }
} 