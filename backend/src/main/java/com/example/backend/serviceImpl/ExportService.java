package com.example.backend.serviceImpl;

import com.example.backend.ENUM.EXPORT_STATE;
import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.ENUM.ORDER_STATUS;
import com.example.backend.model.*;
import com.example.backend.repository.ExportRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.request.ExportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExportService implements com.example.backend.service.ExportService {
    @Autowired
    private ExportRepository exportRepository;

    @Autowired
    private OrderRepository orderRepository;
    @Override
    public Export createExport(ExportRequest export) {
        Export newExport = new Export();
        LocalDate currentDate = LocalDate.now();
        if(export.getCreated_at() == null)
            newExport.setCreatedAt(currentDate);
        else if (export.getCreated_at().compareTo(currentDate) > 0) {
            throw new IllegalArgumentException("Ngày nhập không được lớn hơn ngày hiện tại.");
        }
        newExport.setCreatedAt(export.getCreated_at());
        newExport.setOrderCode(export.getOrderCode());
        newExport.setOrderQuantity(export.getOrderCode().size());
        newExport.setExport_address(export.getExport_address());
        int totalPrice = 0;
<<<<<<< HEAD
        for (String i : export.getOrderCode()){
            Order order = orderRepository.findByorderCode(i);
            order.setOrderStatus(ORDER_STATUS.IN_EXPORT);
=======
        for (String orderCode : exportRequest.getOrderCode()) {
            Order order = orderRepository.findByOrderCode(orderCode);
            if (order == null) {
                throw new IllegalArgumentException("Không tìm thấy đơn hàng với mã: " + orderCode);
            }
            // Khởi tạo state để kiểm tra
            initializeOrderState(order);

            // *** VALIDATION QUAN TRỌNG ***
            // Chỉ cho phép thêm Order đã được xác nhận (CONFIRMED) vào phiếu xuất
            if (order.getOrderState() != ORDER_STATE.CONFIRMED) {
                throw new IllegalArgumentException("Đơn hàng " + orderCode
                        + " phải ở trạng thái CONFIRMED mới được xuất kho. Trạng thái hiện tại: "
                        + order.getOrderState());
            }

            // Kiểm tra xem đơn hàng đã ở trong phiếu xuất khác chưa?
            if (order.getOrderStatus() == ORDER_STATUS.IN_EXPORT) {
                throw new IllegalArgumentException("Đơn hàng " + orderCode + " đã thuộc một phiếu xuất kho khác.");
            }

            // Cập nhật trạng thái xuất kho của Order thông qua OrderService
            try {
                OrderStatusRequest statusRequest = new OrderStatusRequest();
                statusRequest.setOrderStatus(ORDER_STATUS.IN_EXPORT);
                orderService.updateOrderStatus(statusRequest, order.getId()); // Gọi service
            } catch (Exception e) {
                // Xử lý lỗi nếu không cập nhật được status của Order
                throw new RuntimeException(
                        "Lỗi khi cập nhật trạng thái xuất kho cho đơn hàng " + orderCode + ": " + e.getMessage(), e);
            }

>>>>>>> main
            totalPrice += order.getOrderPrice();
            orderRepository.save(order);
        }
        newExport.setPrice(totalPrice);
        newExport.setRevenue(totalPrice*0.1);
        return exportRepository.save(newExport);
    }

    @Override
    public Export updateExport(String exportId, ExportRequest export) throws Exception {
        Export existingExport = exportRepository.findById(exportId).orElse(null);
        if(existingExport == null){
            throw new Exception("Export not found");
        }
        LocalDate currentDate = LocalDate.now();
        if(export.getCreated_at() == null)
            existingExport.setCreatedAt(currentDate);
        else if (export.getUpdated_at().compareTo(currentDate) > 0) {
            throw new IllegalArgumentException("Ngày nhập không được lớn hơn ngày hiện tại.");
        }
        existingExport.setExport_address(export.getExport_address());
        existingExport.setOrderCode(export.getOrderCode());
        existingExport.setOrderQuantity(export.getOrderCode().size());
        existingExport.setUpdatedAt(currentDate);
        int totalPrice = 0;

        for (String i : export.getOrderCode()){
            Order order = orderRepository.findByorderCode(i);
            order.setOrderStatus(ORDER_STATUS.IN_EXPORT);
            totalPrice += order.getOrderPrice();
            orderRepository.save(order);
        }
<<<<<<< HEAD
=======

        // Xử lý các Order mới được thêm vào phiếu xuất
        for (String orderCodeToAdd : codesToAdd) {
            Order order = orderRepository.findByOrderCode(orderCodeToAdd);
            if (order == null) {
                throw new IllegalArgumentException("Không tìm thấy đơn hàng với mã: " + orderCodeToAdd);
            }
            initializeOrderState(order); // Khởi tạo state để kiểm tra

            // Validation tương tự như khi tạo mới
            if (order.getOrderState() != ORDER_STATE.CONFIRMED) {
                throw new IllegalArgumentException("Đơn hàng " + orderCodeToAdd
                        + " phải ở trạng thái CONFIRMED. Trạng thái hiện tại: " + order.getOrderState());
            }
            if (order.getOrderStatus() == ORDER_STATUS.IN_EXPORT) {
                throw new IllegalArgumentException("Đơn hàng " + orderCodeToAdd + " đã thuộc một phiếu xuất kho khác.");
            }

            // Cập nhật status thành IN_EXPORT thông qua OrderService
            OrderStatusRequest statusRequest = new OrderStatusRequest();
            statusRequest.setOrderStatus(ORDER_STATUS.IN_EXPORT);
            orderService.updateOrderStatus(statusRequest, order.getId());
            totalPrice += order.getOrderPrice(); // Cộng giá của order mới thêm
        }

        // Cập nhật lại danh sách order codes và số lượng
        existingExport.setOrderCode(new ArrayList<>(newOrderCodes)); // Cập nhật danh sách mới
        existingExport.setOrderQuantity(newOrderCodes.size());

        // Cập nhật lại tổng giá và doanh thu
>>>>>>> main
        existingExport.setPrice(totalPrice);
        existingExport.setRevenue(totalPrice*0.1);
        return exportRepository.save(existingExport);
    }

    @Override
    public void deleteExport(String exportId) {
        Export export = exportRepository.findById(exportId).orElse(null);
        if(export.getExportState() == EXPORT_STATE.PENDING){
            for(String orderCode : export.getOrderCode()){
                Order order = orderRepository.findByorderCode(orderCode);
                order.setOrderStatus(ORDER_STATUS.OUT_EXPORT);
                orderRepository.save(order);
            }
        }
        exportRepository.deleteById(exportId);
    }

    @Override
    public Export getExportById(String exportId) throws Exception {
        Export export = exportRepository.findById(exportId).orElse(null);
        if(export == null){
            throw new Exception("Export is not found");
        }
        return export;
    }

    @Override
    public List<Export> getAllExport() {
        return exportRepository.findAll();
    }

    @Override
    public List<Export> getExportByState(EXPORT_STATE exportState) {
<<<<<<< HEAD
        List<Export> exports = new ArrayList<>();
        for(Export export : exportRepository.findAll()){
            if (export.getExportState() == exportState){
                exports.add(export);
=======
        return exportRepository.findByExportState(exportState);
    }

    @Override
    @Transactional
    public Export updateExportStatus(String exportId, EXPORT_STATE exportState) throws Exception {
        Export existingExport = exportRepository.findById(exportId)
                .orElseThrow(() -> new Exception("Phiếu xuất không tồn tại với ID: " + exportId));

        existingExport.setExportState(exportState);
        existingExport.setUpdatedAt(LocalDate.now());

        // Nếu phiếu xuất chuyển sang trạng thái ON_GOING, cập nhật trạng thái các Order
        // liên quan
        if (exportState == EXPORT_STATE.ON_GOING) {
            for (String orderCode : existingExport.getOrderCode()) {
                Order order = orderRepository.findByOrderCode(orderCode);
                if (order != null) {
                    initializeOrderState(order); // Khởi tạo state của order
                    try {
                        // Gọi phương thức shipOrder() để chuyển trạng thái Order sang ON_GOING
                        // Chỉ gọi nếu Order đang ở trạng thái CONFIRMED
                        if (order.getOrderState() == ORDER_STATE.CONFIRMED) {
                            order.shipOrder(); // Gọi phương thức của State Pattern
                            orderRepository.save(order); // Lưu lại Order sau khi thay đổi state
                        } else {
                            // Ghi log hoặc xử lý trường hợp Order không ở trạng thái CONFIRMED khi phiếu
                            // xuất bắt đầu giao
                            System.err.println("Cảnh báo: Đơn hàng " + orderCode
                                    + " không ở trạng thái CONFIRMED khi phiếu xuất " + exportId
                                    + " chuyển sang ON_GOING. Trạng thái hiện tại: " + order.getOrderState());
                        }
                    } catch (Exception e) {
                        // Xử lý lỗi nếu không chuyển được trạng thái Order
                        throw new RuntimeException("Lỗi khi cập nhật trạng thái ON_GOING cho đơn hàng " + orderCode
                                + ": " + e.getMessage(), e);
                    }
                }
>>>>>>> main
            }
        }
        return exports;
    }

   @Override
    public Export updateExportStatus(String exportId, EXPORT_STATE exportState) throws Exception {
        Export existingExport = exportRepository.findById(exportId).orElse(null);
        if(existingExport == null){
            throw new Exception("Export not found");
        }
        existingExport.setExportState(exportState);
        if(exportState == EXPORT_STATE.ON_GOING){
            for(String orderCode : existingExport.getOrderCode()){
                Order order = orderRepository.findByorderCode(orderCode);
                order.setOrderState(ORDER_STATE.ON_GOING);
                orderRepository.save(order);
            }
        }
        return exportRepository.save(existingExport);
    }

    @Override
    public List<Export> getExportByDateRange(LocalDate startDate, LocalDate endDate) throws Exception {
        List<Export> importShipments = exportRepository.findBycreatedAtBetween(startDate, endDate);
        if (importShipments == null || importShipments.isEmpty()) {
            throw new Exception("No import shipments found for the given date range.");
        }
        return importShipments;
    }
}
