package com.example.backend.repository;

import com.example.backend.ENUM.ORDER_STATE; // <-- Import Enum trạng thái
import com.example.backend.ENUM.ORDER_STATUS; // <-- Import Enum status xuất kho
import com.example.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    // Giữ lại phương thức cũ (sửa lại tên theo convention)
    List<Order> findByUserId(String userId); // Sửa 'findByuserId' thành 'findByUserId'

    // Sửa lại tên phương thức theo convention
    Order findByOrderCode(String orderCode); // Sửa 'findByorderCode' thành 'findByOrderCode'

    // Thêm phương thức kiểm tra sự tồn tại bằng orderCode (hiệu quả hơn find rồi
    // check null)
    boolean existsByOrderCode(String orderCode);

    // Thêm phương thức tìm kiếm theo trạng thái Enum mới (stateEnum)
    List<Order> findByOrderState(ORDER_STATE orderState);

    // Thêm phương thức tìm kiếm theo trạng thái xuất kho (orderStatus)
    List<Order> findByOrderStatus(ORDER_STATUS orderStatus);

    // Thêm phương thức đếm số lượng đơn hàng theo trạng thái Enum (hữu ích cho
    // thống kê)
    long countByOrderState(ORDER_STATE orderState);

    // Giữ lại phương thức tìm theo tháng/năm đã có
    @Query("{ '$expr': { '$and': [ { '$eq': [ { '$month': '$created_at' }, ?0 ] }, { '$eq': [ { '$year': '$created_at' }, ?1 ] } ] } }")
    List<Order> findOrdersByMonthAndYear(int month, int year);

    // Bạn có thể thêm các phương thức query khác nếu cần thiết
}