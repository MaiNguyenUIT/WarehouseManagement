import SupplierDTO from "../dto/SupplierDTO";

export default class SupplierTransfer {
    static toDTO(supplier) {
        return new SupplierDTO(supplier);
    }

    static toEntity(supplierDTO) {
        return {
            id: supplierDTO.id,
            name: supplierDTO.nameSupplier,
        };
    }
}
