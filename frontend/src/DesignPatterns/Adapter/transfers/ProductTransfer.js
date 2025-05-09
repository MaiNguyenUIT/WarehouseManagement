import ProductDTO from "../dto/ProductDTO";

export default class ProductTransfer {
    static toDTO(product) {
        return new ProductDTO(product);
    }

    static toEntity(productDTO) {
        return {
            id: productDTO.id,
            name: productDTO.productName,
            category_id: productDTO.categoryId,
            category_name: productDTO.categoryName,
            supplier_id: productDTO.supplierId,
            supplier_name: productDTO.supplierName,
            quantity: productDTO.inventory_quantity,
            unit: productDTO.unit,
            price: productDTO.price,
            production_date: productDTO.production_date,
            expiration_date: productDTO.expiration_date,
            status: productDTO.productStatus,
            description: productDTO.description,
            image_url: productDTO.image,
        };
    }
}
