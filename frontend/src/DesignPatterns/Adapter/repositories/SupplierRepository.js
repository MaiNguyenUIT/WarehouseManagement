import axios from "axios";
import SupplierTransfer from "../transfers/SupplierTransfer";
import environment from "../../../config/environment";
import { getAuthHeader } from "../utils/HeaderHelper"; // Import the helper function

export default class SupplierRepository {
    static async fetchAllSuppliers() {
        const response = await axios.get(`${environment.BASE_URL}/api/supplier`, {
            headers: getAuthHeader(), // Use the helper function
        });
        return response.data.map(SupplierTransfer.toDTO); // Transform each supplier to DTO
    }
}
