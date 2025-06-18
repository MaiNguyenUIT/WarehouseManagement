import ApiService from "../../Service/ApiService";
import { uploadImage } from "../../Utils/ImageUtils";

class ProductReceiver {
  async addProduct(inputData, images) {
    console.log('🔵 COMMAND PATTERN: ProductReceiver executing addProduct');
    if (images) {
      inputData.image = await uploadImage(images, inputData.productName, inputData.supplierId);
    }
    const response = await ApiService.createProduct(inputData);
    if (response.status !== 201) {
      throw new Error("Lỗi khi thêm sản phẩm.");
    }
    console.log('✅ COMMAND PATTERN: Product added successfully');
    return {
      status: response.status,
      data: response.data || response // Ensure we return the created product data
    };
  }

  async updateProduct(productId, inputData, images) {
    console.log('🔵 COMMAND PATTERN: ProductReceiver executing updateProduct for ID:', productId);
    if (images) {
      inputData.image = await uploadImage(images, inputData.productName, inputData.supplierId);
    }
    const response = await ApiService.updateProduct(productId, inputData);
    if (response.status !== 200) {
      throw new Error("Lỗi khi cập nhật sản phẩm.");
    }
    console.log('✅ COMMAND PATTERN: Product updated successfully');
    return response;
  }

  async deleteProduct(productId) {
    console.log('🔵 COMMAND PATTERN: ProductReceiver executing deleteProduct for ID:', productId);
    const response = await ApiService.deleteProduct(productId);
    if (response.status !== 200) {
      throw new Error("Lỗi khi xóa sản phẩm.");
    }
    console.log('✅ COMMAND PATTERN: Product deleted successfully');
    return response;
  }
}

export default ProductReceiver;