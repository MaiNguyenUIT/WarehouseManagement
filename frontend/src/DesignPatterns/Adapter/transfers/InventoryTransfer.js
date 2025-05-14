import InventoryDTO from "../dto/InventoryDTO";

export default class InventoryTransfer {
    static toDTO(inventory) {
        return new InventoryDTO({
            id: inventory.id,
            name: inventory.name,
            quantity: inventory.quantity,
            shelfId: inventory.shelfId,
            description: inventory.description,
            typeInventory: inventory.typeInventory,
            status: inventory.status,
            capacity_shelf: inventory.capacity_shelf,
            number_coloum: inventory.number_coloum,
            number_row: inventory.number_row,
            typeInventoryDescription: inventory.typeInventoryDescription,
        });
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
