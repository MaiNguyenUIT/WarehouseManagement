import ADto from './ADto';

export default class InventoryDTO extends ADto {
    id;
    name;
    quantity;
    shelfId;
    description;
    typeInventory;
    status;
    capacity_shelf;
    number_coloum;
    number_row;
    typeInventoryDescription;

    constructor(data) {
        super(data);
        ADto.fill(data, this);
    }
}
