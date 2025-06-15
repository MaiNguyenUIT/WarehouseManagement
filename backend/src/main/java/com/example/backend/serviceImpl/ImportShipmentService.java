package com.example.backend.serviceImpl;
import com.example.backend.model.ImportShipment;
import com.example.backend.model.ImportShipmentItem;
import com.example.backend.model.Product;
import com.example.backend.repository.ImportShipmentRepository;
import com.example.backend.repository.ImportShipmentItemRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;

<<<<<<< HEAD
public class ImportShipmentService implements com.example.backend.service.ImportShipmentService{
=======
public class ImportShipmentService implements com.example.backend.service.ImportShipmentService {
>>>>>>> main
    @Autowired
    private ImportShipmentRepository importShipmentRepository;
    @Autowired
    private ImportShipmentItemRepository importShipmentItemRepository;

    @Override
    public ImportShipment createImportShipment(ImportShipment importShipment) {
        LocalDate currentDate = LocalDate.now();
        if(importShipment.getCreatedAt() == null)
            importShipment.setCreatedAt(currentDate);
        else if (importShipment.getCreatedAt().compareTo(currentDate) > 0) {
            throw new IllegalArgumentException("Ngày nhập không được lớn hơn ngày hiện tại.");
        }
        return importShipmentRepository.save(importShipment);
    }

    @Override
    public ImportShipment updateImportShipment(String id, ImportShipment updatedShipment) {
        Optional<ImportShipment> existingShipmentOpt = importShipmentRepository.findById(id);

        if (existingShipmentOpt.isPresent()) {
            ImportShipment existingShipment = existingShipmentOpt.get();

            LocalDate currentDate = LocalDate.now();
            if(updatedShipment.getCreatedAt() == null)
                updatedShipment.setCreatedAt(currentDate);
            if (updatedShipment.getCreatedAt().compareTo(currentDate) > 0) {
                throw new IllegalArgumentException("Ngày nhập không được lớn hơn ngày hiện tại.");
            }
    
            existingShipment.setSuppiler(updatedShipment.getSuppiler());
            existingShipment.setCreatedAt(updatedShipment.getCreatedAt());

            return importShipmentRepository.save(existingShipment);
        } else {
            throw new RuntimeException("ImportShipment not found with id: " + id);
        }
    }
    @Override
    public ImportShipment getImportShipmentById(String id) {
        return importShipmentRepository.findById(id).orElse(null);
    }

    @Override
    public List<ImportShipment> getAllImportShipments() {
        return importShipmentRepository.findAll();
    }

    @Override
    public List<ImportShipmentItem> getImportShipmentItemsByImportShipmentId(String importshipmentId) throws Exception{
        ImportShipment importShipment = importShipmentRepository.findById(importshipmentId).orElse(null);
        if(importShipment == null){
            throw new Exception("ImportShipment no found.");
        }
        else{
            List<ImportShipmentItem> listitem = new ArrayList<>();
            for(String i : importShipment.getItems()){
                ImportShipmentItem item1 = importShipmentItemRepository.findById(i).orElse(null);
                if(item1 != null){
                    listitem.add(item1);
                }
            } 
            return listitem;
        }
    }

    @Override
    public void deleteImportShipment(String id) throws Exception {
        List<ImportShipmentItem> items = getImportShipmentItemsByImportShipmentId(id);
        if(items != null && !items.isEmpty())
            for(ImportShipmentItem item : items){
                importShipmentItemRepository.deleteById(item.getId());
            }
        importShipmentRepository.deleteById(id);
    }

    @Override
    public BigDecimal getImportShipmentTotalCost(String importShipmentId) throws Exception {
        List<ImportShipmentItem> items = getImportShipmentItemsByImportShipmentId(importShipmentId);
        BigDecimal totalCost = BigDecimal.ZERO;
        for(ImportShipmentItem i : items){
            if (i.getTotalPrice() != null) {
                totalCost = totalCost.add(i.getTotalPrice());
            }
        }
        return totalCost;
    }
    @Override
    public int getQuantityItem(String id) throws Exception{
        List<ImportShipmentItem> items = getImportShipmentItemsByImportShipmentId(id);
        return items.size();
    }

    @Override
    public List<ImportShipment> searchImportShipmentsBysuppiler(String suppiler) {
        return importShipmentRepository.searchBysuppiler(suppiler);
    }

    @Override
    public List<ImportShipment> getImportShipmentsByDateRange(LocalDate startDate, LocalDate endDate) throws Exception {
        List<ImportShipment> importShipments = importShipmentRepository.findByCreatedAtBetween(startDate, endDate);
        if (importShipments == null || importShipments.isEmpty()) {
            throw new Exception("No import shipments found for the given date range.");
        }
        return importShipments;
    }
}
