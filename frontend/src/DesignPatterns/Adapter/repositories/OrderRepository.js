import axios from "axios";
import environment from "../../../config/environment";
import { getAuthHeader } from "../utils/HeaderHelper"; // Import the helper function

export default class OrderRepository {
    static async fetchAllOrders() {
        const response = await axios.get(`${environment.BASE_URL}/api/admin/order`, {
            headers: getAuthHeader(), // Use the helper function
        });
        return response.data;
    }
}
