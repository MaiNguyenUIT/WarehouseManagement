import ADto from './ADto';

export default class ShelfDTO extends ADto {
    id;
    code;
    location;
    inventoryId;
    productId;
    quantity;
    capacity;
    coloum;
    row;

    constructor(data) {
        super(data);
        ADto.fill(data, this);
    }

    get locationText() {
        return this.location ? `Location: ${this.location}` : 'No location specified';
    }
}
