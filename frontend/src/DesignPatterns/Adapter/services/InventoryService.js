import InventoryRepository from "../repositories/InventoryRepository";
import InventoryDTO from "../dto/InventoryDTO";

export default class InventoryService {
    static async getAllInventories() {
        const inventories = await InventoryRepository.fetchAllInventories();
        return inventories.map((inventory) => new InventoryDTO(inventory));
    }
}
