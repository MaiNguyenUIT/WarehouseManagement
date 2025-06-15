package com.example.backend.pattern.Decorator;

import com.example.backend.model.ImportShipment;
import com.example.backend.service.ImportShipmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SecurityImportShipmentServiceDecorator extends ImportShipmentServiceDecorator {

    private final Logger logger = LoggerFactory.getLogger(SecurityImportShipmentServiceDecorator.class);

    public SecurityImportShipmentServiceDecorator(ImportShipmentService delegate) {
        super(delegate);
    }

    private String getCurrentUserRole() {
        // In a real application, this would come from a security context.
        // For this demo, we'll just hardcode it. Can be changed to "USER" to test failure.
        return "ADMIN";
    }

    private void checkAdmin() {
        if (!"ADMIN".equals(getCurrentUserRole())) {
            logger.warn("Security check failed: User with role {} attempted a restricted operation.", getCurrentUserRole());
            throw new SecurityException("User does not have ADMIN privileges.");
        }
        logger.info("Security check passed for user with role ADMIN.");
    }

    @Override
    public ImportShipment createImportShipment(ImportShipment importShipment) {
        checkAdmin();
        return super.createImportShipment(importShipment);
    }

    @Override
    public ImportShipment updateImportShipment(String id, ImportShipment updatedShipment) {
        checkAdmin();
        return super.updateImportShipment(id, updatedShipment);
    }

    @Override
    public void deleteImportShipment(String id) throws Exception {
        checkAdmin();
        super.deleteImportShipment(id);
    }
} 