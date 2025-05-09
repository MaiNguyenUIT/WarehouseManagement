import OrderRepository from "../repositories/OrderRepository";
import OrderDTO from "../dto/OrderDTO";

export default class OrderService {
    static async getAllOrders() {
        const orders = await OrderRepository.fetchAllOrders();
        return orders.map((order) => new OrderDTO(order));
    }
}
