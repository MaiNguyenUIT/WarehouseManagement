import AuthDTO from "../dto/AuthDTO";

export default class AuthTransfer {
    static toDTO(authData) {
        return new AuthDTO(authData);
    }

    static toEntity(authDTO) {
        return {
            token: authDTO.token,
            role: authDTO.role,
            userId: authDTO.userId,
        };
    }
}
