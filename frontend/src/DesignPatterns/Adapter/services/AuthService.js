import AuthRepository from "../repositories/AuthRepository";
import AuthDTO from "../dto/AuthDTO";

export default class AuthService {
    static async loginUser(loginDetails) {
        const authData = await AuthRepository.loginUser(loginDetails);
        return new AuthDTO(authData);
    }
}
