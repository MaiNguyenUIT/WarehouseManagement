import SupplierDTO from "../dto/SupplierDTO";

export default class SupplierTransfer {
    static toDTO(supplier) {
        return new SupplierDTO({
            id: supplier.id,
            nameSupplier: supplier.name,
            phoneNumber: supplier.phoneNumber,
            address: supplier.address,
        });
    }

    static toEntity(supplierDTO) {
        return {
            id: supplierDTO.id,
            name: supplierDTO.nameSupplier,
        };
    }
}
