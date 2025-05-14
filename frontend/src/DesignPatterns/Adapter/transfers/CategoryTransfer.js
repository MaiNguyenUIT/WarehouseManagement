import CategoryDTO from "../dto/CategoryDTO";

export default class CategoryTransfer {
    static toDTO(category) {
        return new CategoryDTO({
            id: category.id,
            categoryName: category.name,
            description: category.description,
        });
    }

    static toEntity(categoryDTO) {
        return {
            id: categoryDTO.id,
            name: categoryDTO.categoryName,
        };
    }
}
