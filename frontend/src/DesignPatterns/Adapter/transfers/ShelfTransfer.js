import ShelfDTO from "../dto/ShelfDTO";

export default class ShelfTransfer {
    static toDTO(shelf) {
        return new ShelfDTO(shelf);
    }

    static toEntity(shelfDTO) {
        return {
            id: shelfDTO.id,
            code: shelfDTO.code,
            location: shelfDTO.location,
        };
    }
}
