import ADto from './ADto';

export default class ExportDTO extends ADto {
    id;
    productId;
    quantity;
    exportDate;
    exportState;
    exportAddress;

    constructor(data) {
        super(data);
        ADto.fill(data, this);
    }
}
