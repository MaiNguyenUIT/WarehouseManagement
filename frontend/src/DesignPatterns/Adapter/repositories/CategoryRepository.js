import axios from "axios";
import CategoryTransfer from "../transfers/CategoryTransfer";
import environment from "../../../config/environment";
import { getAuthHeader } from "../utils/HeaderHelper"; // Import the helper function

export default class CategoryRepository {
    static async fetchAllCategories() {
        const response = await axios.get(`${environment.BASE_URL}/api/category`, {
            headers: getAuthHeader(), // Use the helper function
        });
        return response.data.map(CategoryTransfer.toDTO); // Transform each category to DTO
    }
}
