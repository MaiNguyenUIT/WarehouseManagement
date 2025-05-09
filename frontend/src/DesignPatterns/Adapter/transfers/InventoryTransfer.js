import InventoryDTO from "../dto/InventoryDTO";

export default class InventoryTransfer {
    static toDTO(inventory) {
        return new InventoryDTO(inventory);
    }

    static toEntity(inventoryDTO) {
        return {
            id: inventoryDTO.id,
            name: inventoryDTO.name,
            quantity: inventoryDTO.quantity,
            shelfId: inventoryDTO.shelfId,
            description: inventoryDTO.description,
        };
    }
}
