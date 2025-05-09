import axios from "axios";
import AuthTransfer from "../transfers/AuthTransfer";
import environment from "../../../config/environment";

export default class AuthRepository {
    static async loginUser(loginDetails) {
        const response = await axios.post(`${environment.BASE_URL}/auth/signin`, loginDetails);
        return AuthTransfer.toDTO(response.data); // Transform response data to DTO
    }
}
