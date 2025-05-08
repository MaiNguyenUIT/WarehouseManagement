import ShelfRepository from "../repositories/ShelfRepository";
import ShelfDTO from "../dto/ShelfDTO";

export default class ShelfService {
    static async getAllShelves() {
        const shelves = await ShelfRepository.fetchAllShelves();
        return shelves.map((shelf) => new ShelfDTO(shelf));
    }
}
