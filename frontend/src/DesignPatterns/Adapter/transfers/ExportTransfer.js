import ExportDTO from "../dto/ExportDTO";

export default class ExportTransfer {
    static toDTO(exportData) {
        return new ExportDTO(exportData);
    }

    static toEntity(exportDTO) {
        return {
            id: exportDTO.id,
            productId: exportDTO.productId,
            quantity: exportDTO.quantity,
            exportDate: exportDTO.exportDate,
        };
    }
}
