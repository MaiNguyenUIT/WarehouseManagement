import ADto from './ADto';

export default class SupplierDTO extends ADto {
    id;
    nameSupplier;
    phoneNumber;
    address;

    constructor(data) {
        super(data);
        ADto.fill(data, this);
    }
}
