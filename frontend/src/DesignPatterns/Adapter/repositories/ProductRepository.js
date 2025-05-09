import axios from "axios";
import ProductTransfer from "../transfers/ProductTransfer";
import environment from "../../../config/environment";
import { getAuthHeader } from "../utils/HeaderHelper"; // Import the helper function

export default class ProductRepository {
  static async fetchAllProducts() {
    const response = await axios.get(`${environment.BASE_URL}/api/product`, {
      headers: getAuthHeader(), // Use the helper function
    });
    return response.data.map(ProductTransfer.toDTO); // Transform each product to DTO
  }

  static async fetchProductById(id) {
    const response = await axios.get(
      `${environment.BASE_URL}/api/product/getById/${id}`,
      {
        headers: getAuthHeader(), // Use the helper function
      }
    );
    return ProductTransfer.toDTO(response.data); // Transform response data to DTO
  }

  static async addProduct(formData) {
    const entity = ProductTransfer.toEntity(formData); // Transform DTO to entity
    const response = await axios.post(
      `${environment.BASE_URL}/api/product`,
      entity,
      {
        headers: getAuthHeader(), // Use the helper function
      }
    );
    return ProductTransfer.toDTO(response.data); // Transform response data to DTO
  }

  static async updateProduct(id, formData) {
    const entity = ProductTransfer.toEntity(formData); // Transform DTO to entity
    const response = await axios.put(
      `${environment.BASE_URL}/api/product/${id}`,
      entity,
      {
        headers: getAuthHeader(), // Use the helper function
      }
    );
    return ProductTransfer.toDTO(response.data); // Transform response data to DTO
  }

  static async deleteProduct(id) {
    const response = await axios.delete(
      `${environment.BASE_URL}/api/product/${id}`,
      {
        headers: getAuthHeader(), // Use the helper function
      }
    );
    return response.data;
  }

  static async searchProducts(keyword) {
    const response = await axios.get( `${environment.BASE_URL}/api/product/search`,
      {
        params: { keyword },
        headers: getAuthHeader(),
      }
    );
    return response.data.map(ProductTransfer.toDTO);
  }
}
