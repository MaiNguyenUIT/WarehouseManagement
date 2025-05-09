import axios from "axios";
import environment from "../../../../config/environment";
import { getAuthHeader } from "../utils/HeaderHelper"; // Import the helper function

export default class ShelfRepository {
    static async fetchAllShelves() {
        const response = await axios.get(`${environment.BASE_URL}/api/shelf/all`, {
            headers: getAuthHeader(), // Use the helper function
        });
        return response.data;
    }
}
