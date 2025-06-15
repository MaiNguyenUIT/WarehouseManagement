package com.example.backend.pattern.Decorator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.example.backend.model.ImportShipment;
import com.example.backend.model.ImportShipmentItem;
import com.example.backend.service.ImportShipmentService;

public abstract class ImportShipmentServiceDecorator implements ImportShipmentService {

    protected final ImportShipmentService delegate;

    protected ImportShipmentServiceDecorator(ImportShipmentService delegate) {
        this.delegate = delegate;
    }

    @Override
    public ImportShipment createImportShipment(ImportShipment importShipment) {
        return delegate.createImportShipment(importShipment);
    }

    @Override
    public ImportShipment updateImportShipment(String id, ImportShipment updatedShipment) {
        return delegate.updateImportShipment(id, updatedShipment);
    }

    @Override
    public ImportShipment getImportShipmentById(String id) {
        return delegate.getImportShipmentById(id);
    }

    @Override
    public List<ImportShipment> getAllImportShipments() {
        return delegate.getAllImportShipments();
    }

    @Override
    public List<ImportShipmentItem> getImportShipmentItemsByImportShipmentId(String importShipmentId) throws Exception {
        return delegate.getImportShipmentItemsByImportShipmentId(importShipmentId);
    }

    @Override
    public void deleteImportShipment(String id) throws Exception {
        delegate.deleteImportShipment(id);
    }

    @Override
    public BigDecimal getImportShipmentTotalCost(String importShipmentId) throws Exception {
        return delegate.getImportShipmentTotalCost(importShipmentId);
    }

    @Override
    public int getQuantityItem(String id) throws Exception {
        return delegate.getQuantityItem(id);
    }

    @Override
    public List<ImportShipment> searchImportShipmentsBysuppiler(String supplier) {
        return delegate.searchImportShipmentsBysuppiler(supplier);
    }

    @Override
    public List<ImportShipment> getImportShipmentsByDateRange(LocalDate startDate, LocalDate endDate) throws Exception {
        return delegate.getImportShipmentsByDateRange(startDate, endDate);
    }
}
