import axios from "axios";
import environment from "../../../config/environment";
import { getAuthHeader } from "../utils/HeaderHelper"; // Import the helper function

export default class ReportRepository {
    static async fetchAllReports() {
        const response = await axios.get(`${environment.BASE_URL}/api/admin/report`, {
            headers: getAuthHeader(), // Use the helper function
        });
        return response.data;
    }
}
