import OrderDTO from "../dto/OrderDTO";

export default class OrderTransfer {
    static toDTO(order) {
        return new OrderDTO(order);
    }

    static toEntity(orderDTO) {
        return {
            id: orderDTO.id,
            orderCode: orderDTO.orderCode,
            customerName: orderDTO.customerName,
            items: orderDTO.items,
            totalAmount: orderDTO.totalAmount,
            status: orderDTO.status,
        };
    }
}
