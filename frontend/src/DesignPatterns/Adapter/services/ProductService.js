import ProductRepository from "../repositories/ProductRepository";
import ProductDTO from "../dto/ProductDTO";

export default class ProductService {
  static async getAllProducts() {
    const products = await ProductRepository.fetchAllProducts();
    return products.map((product) => new ProductDTO(product));
  }

  static async getProductById(id) {
    const product = await ProductRepository.fetchProductById(id);
    return new ProductDTO(product);
  }

  static async addProduct(formData) {
    return await ProductRepository.addProduct(formData);
  }

  static async updateProduct(id, formData) {
    return await ProductRepository.updateProduct(id, formData);
  }

  static async deleteProduct(id) {
    return await ProductRepository.deleteProduct(id);
  }

  static async searchProducts(keyword) {
    return await ProductRepository.searchProducts(keyword);
  }
}
