import ADto from './ADto';

export default class AuthDTO extends ADto {
    token;
    role;
    userId;

    constructor(data) {
        super(data);
        ADto.fill(data, this);
    }
}
