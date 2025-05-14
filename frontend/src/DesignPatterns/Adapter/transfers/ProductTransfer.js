import ProductDTO from "../dto/ProductDTO";

export default class ProductTransfer {
  static toDTO(product) {
    return new ProductDTO({
      id: product.id,
      productName: product.name,
      categoryId: product.category_id,
      categoryName: product.category_name,
      supplierId: product.supplier_id,
      supplierName: product.supplier_name,
      inventory_quantity: product.quantity,
      unit: product.unit,
      price: product.price,
      production_date: product.production_date,
      expiration_date: product.expiration_date,
      productStatus: product.status,
      description: product.description,
      image: product.image_url,
    });
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
