import ADto from './ADto';

export default class ProductDTO extends ADto {
    id;
    productName;
    categoryId;
    categoryName;
    supplierId;
    supplierName;
    inventory_quantity;
    unit;
    price;
    production_date;
    expiration_date;
    productStatus;
    description;
    image;

    constructor(data) {
        super(data);
        ADto.fill(data, this);
    }
}
