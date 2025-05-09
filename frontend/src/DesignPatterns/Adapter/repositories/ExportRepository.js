import axios from "axios";
import environment from "../../../config/environment";
import { getAuthHeader } from "../utils/HeaderHelper"; // Import the helper function

export default class ExportRepository {
    static async fetchAllExports() {
        const response = await axios.get(`${environment.BASE_URL}/api/export`, {
            headers: getAuthHeader(), // Use the helper function
        });
        return response.data;
    }
}
