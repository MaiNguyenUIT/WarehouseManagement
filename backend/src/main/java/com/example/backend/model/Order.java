package com.example.backend.model;

import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.ENUM.ORDER_STATUS;
import com.example.backend.repository.OrderItemRepository; // Cần import
import com.example.backend.request.OrderItemRequest; // Cần import
import com.example.backend.state.OrderState; // Cần import
import com.example.backend.state.OrderStateFactory; // Cần import
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient; // Đánh dấu không lưu vào DB
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.util.List;

@Data
@Document("orders")
public class Order {
    @Id
    private String id;
    @Field("user_id")
    private String userId;
    private List<String> orderItem_code;
    private int orderItem_quantity;

    @Field("order_state") // Đổi tên field lưu enum trong DB nếu muốn
    private ORDER_STATE stateEnum = ORDER_STATE.PENDING; // <-- Trường lưu trạng thái Enum vào DB

    @Transient // <-- Không lưu trường này vào DB
    private OrderState currentState; // <-- Trường giữ đối tượng State hiện tại

    private String delivery_Address;
    private LocalDate created_at;
    private LocalDate update_at;
    private int orderPrice;
    private String orderCode;
    private ORDER_STATUS orderStatus = ORDER_STATUS.OUT_EXPORT;

    // ----- Các phương thức ủy thác cho State -----

    // Phương thức để thiết lập State hiện tại (quan trọng khi tải từ DB)
    public void setCurrentState(OrderState state) {
        this.currentState = state;
        this.stateEnum = state.getStateEnum(); // Đồng bộ stateEnum
    }

    // Lấy State hiện tại (khởi tạo nếu cần)
    public OrderState getCurrentState() {
        if (currentState == null) {
            // Khởi tạo state từ stateEnum khi đối tượng được tải lần đầu
            this.currentState = OrderStateFactory.getState(this.stateEnum);
        }
        return currentState;
    }

    // Các phương thức hành động, ủy thác cho state hiện tại
    // Lưu ý: Cần truyền các dependency (như repository) vào nếu State cần dùng
    public void confirmOrder() throws Exception {
        getCurrentState().confirmOrder(this);
    }

    public void shipOrder() throws Exception {
        getCurrentState().shipOrder(this);
    }

    public void deliverOrder() throws Exception {
        getCurrentState().deliverOrder(this);
    }

    // Truyền OrderItemRepository vào vì CancelledState cần dùng nó
    public void cancelOrder(OrderItemRepository orderItemRepository) throws Exception {
        getCurrentState().cancelOrder(this, orderItemRepository);
    }

    // Truyền OrderItemRepository vào vì PendingState cần dùng nó
    public void updateOrderDetails(OrderItemRequest request, OrderItemRepository orderItemRepository) throws Exception {
        getCurrentState().updateOrderDetails(this, request, orderItemRepository);
    }

    // Có thể thêm các phương thức khác nếu cần
}