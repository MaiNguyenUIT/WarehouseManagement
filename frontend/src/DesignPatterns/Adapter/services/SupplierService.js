import SupplierRepository from "../repositories/SupplierRepository";
import SupplierDTO from "../dto/SupplierDTO";

export default class SupplierService {
    static async getAllSuppliers() {
        const suppliers = await SupplierRepository.fetchAllSuppliers();
        return suppliers.map((supplier) => new SupplierDTO(supplier));
    }
}
