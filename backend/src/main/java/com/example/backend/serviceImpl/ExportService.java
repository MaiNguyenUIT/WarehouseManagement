package com.example.backend.serviceImpl;

import com.example.backend.ENUM.EXPORT_STATE;
import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.ENUM.ORDER_STATUS;
import com.example.backend.model.*;
import com.example.backend.repository.ExportRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.request.ExportRequest;
import com.example.backend.request.OrderStatusRequest;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ExportService implements com.example.backend.service.ExportService {
    @Autowired
    private ExportRepository exportRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    private Order initializeOrderState(Order order) {
        if (order != null) {
            order.getCurrentState();
        }
        return order;
    }

    @Override
    @Transactional
    public Export createExport(ExportRequest exportRequest) {
        Export newExport = new Export();
        LocalDate currentDate = LocalDate.now();

        // Xác thực ngày tạo
        LocalDate createdAt = exportRequest.getCreated_at();
        if (createdAt == null) {
            createdAt = currentDate;
        } else if (createdAt.isAfter(currentDate)) { // Dùng isAfter cho rõ ràng
            throw new IllegalArgumentException("Ngày tạo không được lớn hơn ngày hiện tại.");
        }
        newExport.setCreatedAt(createdAt);

        newExport.setOrderCode(exportRequest.getOrderCode());
        newExport.setOrderQuantity(exportRequest.getOrderCode().size());
        newExport.setExport_address(exportRequest.getExport_address());
        // Mặc định trạng thái khi tạo mới là PENDING
        newExport.setExportState(EXPORT_STATE.PENDING);

        int totalPrice = 0;
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

            totalPrice += order.getOrderPrice();
        }
        newExport.setPrice(totalPrice);
        // Tính toán doanh thu (revenue) - có thể cần logic phức tạp hơn
        newExport.setRevenue(totalPrice * 0.1); // Giữ nguyên logic cũ

        return exportRepository.save(newExport);
    }

    @Override
    @Transactional
    public Export updateExport(String exportId, ExportRequest exportRequest) throws Exception {
        Export existingExport = exportRepository.findById(exportId)
                .orElseThrow(() -> new Exception("Phiếu xuất không tồn tại với ID: " + exportId));

        // Kiểm tra trạng thái của phiếu xuất: Chỉ cho phép sửa khi là PENDING hoặc
        // CONFIRMED
        // Sửa lại điều kiện kiểm tra, bỏ DONE vì không có trong Enum
        if (existingExport.getExportState() == EXPORT_STATE.ON_GOING) { // Chỉ kiểm tra ON_GOING
            throw new Exception("Không thể cập nhật phiếu xuất ở trạng thái " + existingExport.getExportState());
        }

        LocalDate currentDate = LocalDate.now();
        // Chỉ cập nhật ngày tạo nếu được cung cấp và hợp lệ
        if (exportRequest.getCreated_at() != null) {
            if (exportRequest.getCreated_at().isAfter(currentDate)) {
                throw new IllegalArgumentException("Ngày tạo không được lớn hơn ngày hiện tại.");
            }
            existingExport.setCreatedAt(exportRequest.getCreated_at());
        }

        existingExport.setExport_address(exportRequest.getExport_address());
        existingExport.setUpdatedAt(currentDate); // Luôn cập nhật ngày update

        // Xử lý danh sách Order Codes mới và cũ
        Set<String> oldOrderCodes = new HashSet<>(existingExport.getOrderCode());
        Set<String> newOrderCodes = new HashSet<>(exportRequest.getOrderCode());

        Set<String> codesToAdd = new HashSet<>(newOrderCodes);
        codesToAdd.removeAll(oldOrderCodes); // Mã cần thêm vào

        Set<String> codesToRemove = new HashSet<>(oldOrderCodes);
        codesToRemove.removeAll(newOrderCodes); // Mã cần loại bỏ

        int totalPrice = existingExport.getPrice(); // Bắt đầu với giá trị cũ

        // Xử lý các Order bị loại bỏ khỏi phiếu xuất
        for (String orderCodeToRemove : codesToRemove) {
            Order order = orderRepository.findByOrderCode(orderCodeToRemove);
            if (order != null) {
                // Cập nhật status về OUT_EXPORT thông qua OrderService
                OrderStatusRequest statusRequest = new OrderStatusRequest();
                statusRequest.setOrderStatus(ORDER_STATUS.OUT_EXPORT);
                orderService.updateOrderStatus(statusRequest, order.getId());
                totalPrice -= order.getOrderPrice(); // Trừ giá của order bị loại bỏ
            }
        }

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
        existingExport.setPrice(totalPrice);
        existingExport.setRevenue(totalPrice * 0.1); // Tính lại doanh thu

        return exportRepository.save(existingExport);
    }

    @Override
    @Transactional
    public void deleteExport(String exportId) throws Exception {
        Export export = exportRepository.findById(exportId)
                .orElseThrow(() -> new Exception("Phiếu xuất không tồn tại với ID: " + exportId));

        if (export.getExportState() != EXPORT_STATE.PENDING) {
            throw new Exception(
                    "Chỉ có thể xóa phiếu xuất ở trạng thái PENDING. Trạng thái hiện tại: " + export.getExportState());
        }

        for (String orderCode : export.getOrderCode()) {
            Order order = orderRepository.findByOrderCode(orderCode);
            if (order != null && order.getOrderStatus() == ORDER_STATUS.IN_EXPORT) {
                try {
                    OrderStatusRequest statusRequest = new OrderStatusRequest();
                    statusRequest.setOrderStatus(ORDER_STATUS.OUT_EXPORT);
                    orderService.updateOrderStatus(statusRequest, order.getId());
                } catch (Exception e) {
                    System.err.println("Lỗi khi cập nhật trạng thái OUT_EXPORT cho đơn hàng " + orderCode
                            + " khi xóa phiếu xuất " + exportId + ": " + e.getMessage());
                }
            }
        }

        exportRepository.deleteById(exportId);
    }

    @Override
    public Export getExportById(String exportId) throws Exception {
        return exportRepository.findById(exportId)
                .orElseThrow(() -> new Exception("Phiếu xuất không tồn tại với ID: " + exportId));
    }

    @Override
    public List<Export> getAllExport() {
        return exportRepository.findAll();
    }

    @Override
    public List<Export> getExportByState(EXPORT_STATE exportState) {
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
            }
        }

        return exportRepository.save(existingExport);
    }

    @Override
    public List<Export> getExportByDateRange(LocalDate startDate, LocalDate endDate) throws Exception {
        List<Export> exports = exportRepository.findAll().stream()
                .filter(e -> !e.getCreatedAt().isBefore(startDate) && !e.getCreatedAt().isAfter(endDate))
                .collect(Collectors.toList());

        if (exports.isEmpty()) {

            return new ArrayList<>(); // Trả về danh sách rỗng
        }
        return exports;
    }

}