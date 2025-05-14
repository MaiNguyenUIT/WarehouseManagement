import ShelfDTO from "../dto/ShelfDTO";

export default class ShelfTransfer {
    static toDTO(shelf) {
        return new ShelfDTO({
            id: shelf.id,
            code: shelf.code,
            location: shelf.location,
            inventoryId: shelf.inventoryId,
            productId: shelf.productId,
            quantity: shelf.quantity,
            capacity: shelf.capacity,
            coloum: shelf.coloum,
            row: shelf.row,
        });
    }

    static toEntity(shelfDTO) {
        return {
            id: shelfDTO.id,
            code: shelfDTO.code,
            location: shelfDTO.location,
        };
    }
}
