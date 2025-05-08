import axios from "axios";
import InventoryTransfer from "../transfers/InventoryTransfer";
import environment from "../../../config/environment";
import { getAuthHeader } from "../utils/HeaderHelper"; // Import the helper function

export default class InventoryRepository {
    static async fetchAllInventories() {
        const response = await axios.get(`${environment.BASE_URL}/api/inventory`, {
            headers: getAuthHeader(), // Use the helper function
        });
        return response.data.map(InventoryTransfer.toDTO); // Transform each inventory to DTO
    }
}
