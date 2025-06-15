import CategoryRepository from "../repositories/CategoryRepository";
import CategoryDTO from "../dto/CategoryDTO";

export default class CategoryService {
    static async getAllCategories() {
        const categories = await CategoryRepository.fetchAllCategories();
        return categories.map((category) => new CategoryDTO(category));
    }
}
