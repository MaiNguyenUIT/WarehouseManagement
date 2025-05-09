import CategoryDTO from "../dto/CategoryDTO";

export default class CategoryTransfer {
    static toDTO(category) {
        return new CategoryDTO(category);
    }

    static toEntity(categoryDTO) {
        return {
            id: categoryDTO.id,
            name: categoryDTO.categoryName,
        };
    }
}
