import ModernProductInterface from "../interfaces/ModernProductInterface";
import LegacyProductAPI from "../legacy/LegacyProductAPI";

// True Adapter Pattern implementation
export default class ProductServiceAdapter extends ModernProductInterface {
  constructor() {
    super();
    this.legacyAPI = LegacyProductAPI;
  }

  async getAllProducts() {
    try {
      console.log('🟠 ADAPTER PATTERN: Fetching products via ProductServiceAdapter');
      // Gọi legacy API
      const legacyResponse = await this.legacyAPI.getProducts();
      
      if (!legacyResponse.success) {
        throw new Error("Failed to fetch products from legacy API");
      }

      // Chuyển đổi từ legacy format sang modern format
      const products = legacyResponse.items.map(item => ({
        id: item.prod_id,
        productName: item.prod_name,
        categoryId: item.cat_id,
        categoryName: item.cat_name || 'Unknown',
        supplierId: item.sup_id,
        supplierName: item.sup_name || 'Unknown',
        inventory_quantity: item.qty,
        unit: item.prod_unit,
        price: item.prod_price,
        production_date: item.create_date,
        expiration_date: item.expire_date,
        productStatus: item.status === "AVAILABLE" ? "IN_STOCK" : "OUT_STOCK",
        description: item.desc,
        image: item.img
      }));
      
      console.log(`✅ ADAPTER PATTERN: Successfully adapted ${products.length} products`);
      return products;
    } catch (error) {
      console.error("❌ ADAPTER PATTERN: Error in ProductServiceAdapter.getAllProducts:", error);
      throw error;
    }
  }

  async getProductById(id) { // eslint-disable-line no-unused-vars
    // Implementation would be similar to getAllProducts
    // but for single product
    throw new Error("Not implemented yet");
  }

  async addProduct(productData) {
    try {
      // Chuyển đổi từ modern format sang legacy format
      const legacyData = {
        name: productData.productName,
        category: productData.categoryId,
        supplier: productData.supplierId,
        quantity: productData.inventory_quantity,
        unit: productData.unit,
        price: productData.price,
        productionDate: productData.production_date,
        expirationDate: productData.expiration_date,
        status: productData.productStatus === "IN_STOCK" ? "AVAILABLE" : "UNAVAILABLE",
        description: productData.description,
        image: productData.image
      };

      const response = await this.legacyAPI.createProduct(legacyData);
      
      if (!response.success) {
        throw new Error("Failed to create product in legacy API");
      }      return {
        status: 201,
        data: {
          id: response.created_id,
          ...productData
        }
      };
    } catch (error) {
      console.error("Error in ProductServiceAdapter.addProduct:", error);
      throw error;
    }
  }

  async updateProduct(id, productData) { // eslint-disable-line no-unused-vars
    // Implementation would adapt update calls to legacy API
    throw new Error("Not implemented yet");
  }

  async deleteProduct(id) { // eslint-disable-line no-unused-vars
    // Implementation would adapt delete calls to legacy API
    throw new Error("Not implemented yet");
  }
}
