import ADto from './ADto';

export default class CategoryDTO extends ADto {
    id;
    categoryName;
    description;

    constructor(data) {
        super(data);
        ADto.fill(data, this);
    }
}
