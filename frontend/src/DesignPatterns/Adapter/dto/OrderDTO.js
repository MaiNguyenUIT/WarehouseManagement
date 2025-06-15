import ADto from './ADto';

export default class OrderDTO extends ADto {
    id;
    orderCode;
    customerName;
    items;
    totalAmount;
    status;
    createdAt;
    deliveryAddress;

    constructor(data) {
        super(data);
        ADto.fill(data, this);
    }
}
