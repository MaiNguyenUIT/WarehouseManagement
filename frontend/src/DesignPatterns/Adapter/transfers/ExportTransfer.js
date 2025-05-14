import ExportDTO from "../dto/ExportDTO";

export default class ExportTransfer {
    static toDTO(exportData) {
        return new ExportDTO({
            id: exportData.id,
            productId: exportData.productId,
            quantity: exportData.quantity,
            exportDate: exportData.exportDate,
            exportState: exportData.exportState,
            exportAddress: exportData.exportAddress,
        });
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
