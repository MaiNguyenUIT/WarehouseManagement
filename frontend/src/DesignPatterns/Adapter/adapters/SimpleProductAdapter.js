import ApiService from "../../../Service/ApiService";

/**
 * Simple Adapter Pattern Implementation
 * Adapter này đóng vai trò như một cầu nối giữa client (Product page) 
 * và ApiService, cung cấp interface thống nhất và xử lý dữ liệu
 */
export default class SimpleProductAdapter {
  constructor() {
    this.apiService = ApiService;
  }

  /**
   * Lấy tất cả sản phẩm với dữ liệu đã được chuẩn hóa
   */
  async getAllProducts() {
    try {
      console.log('🟠 ADAPTER PATTERN: SimpleProductAdapter calling ApiService.getAllProducts()');
      
      // Gọi API thông qua ApiService
      const rawProducts = await this.apiService.getAllProducts();
      
      // Adapter chuyển đổi và chuẩn hóa dữ liệu
      const adaptedProducts = rawProducts.map(product => ({
        ...product,
        // Đảm bảo các field quan trọng luôn có giá trị
        productName: product.productName || 'Unknown Product',
        categoryName: product.categoryName || 'Unknown Category',
        supplierName: product.supplierName || 'Unknown Supplier',
        inventory_quantity: product.inventory_quantity || 0,
        price: product.price || 0,
        productStatus: product.productStatus || 'OUT_STOCK',
        // Chuẩn hóa format ngày tháng
        production_date: product.production_date ? new Date(product.production_date).toISOString() : null,
        expiration_date: product.expiration_date ? new Date(product.expiration_date).toISOString() : null,
        // Thêm index để hỗ trợ UI
        stt: product.id
      }));

      console.log(`✅ ADAPTER PATTERN: Successfully adapted ${adaptedProducts.length} products`);
      return adaptedProducts;
      
    } catch (error) {
      console.error('❌ ADAPTER PATTERN: Error in SimpleProductAdapter.getAllProducts:', error);
      // Adapter có thể xử lý lỗi và trả về dữ liệu mặc định
      throw new Error(`Failed to load products: ${error.message}`);
    }
  }

  /**
   * Tìm kiếm sản phẩm với keyword
   */
  async searchProducts(keyword) {
    try {
      console.log(`🟠 ADAPTER PATTERN: SimpleProductAdapter searching for "${keyword}"`);
      
      // Lấy tất cả sản phẩm và filter
      const allProducts = await this.getAllProducts();
      const filteredProducts = allProducts.filter(product => 
        product.productName.toLowerCase().includes(keyword.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(keyword.toLowerCase()) ||
        product.supplierName.toLowerCase().includes(keyword.toLowerCase())
      );

      console.log(`✅ ADAPTER PATTERN: Found ${filteredProducts.length} products matching "${keyword}"`);
      return filteredProducts;
      
    } catch (error) {
      console.error('❌ ADAPTER PATTERN: Error in SimpleProductAdapter.searchProducts:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê sản phẩm
   */
  async getProductStats() {
    try {
      console.log('🟠 ADAPTER PATTERN: SimpleProductAdapter calculating product statistics');
      
      const products = await this.getAllProducts();
      const stats = {
        total: products.length,
        inStock: products.filter(p => p.productStatus === 'IN_STOCK').length,
        outOfStock: products.filter(p => p.productStatus === 'OUT_STOCK').length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.inventory_quantity), 0),
        avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0
      };

      console.log('✅ ADAPTER PATTERN: Product statistics calculated:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ ADAPTER PATTERN: Error in SimpleProductAdapter.getProductStats:', error);
      throw error;
    }
  }
}
