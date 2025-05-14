import OrderDTO from "../dto/OrderDTO";

export default class OrderTransfer {
    static toDTO(order) {
        return new OrderDTO({
            id: order.id,
            orderCode: order.orderCode,
            customerName: order.customerName,
            items: order.items,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
            deliveryAddress: order.deliveryAddress,
        });
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
