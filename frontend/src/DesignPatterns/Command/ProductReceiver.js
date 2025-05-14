import ProductService from "../Adapter/services/ProductService";
import { uploadImage } from "../../Utils/ImageUtils";

class ProductReceiver {
  async addProduct(inputData, images) {
    if (images) {
      inputData.image = await uploadImage(images, inputData.productName, inputData.supplierId);
    }
    const response = await ProductService.addProduct(inputData);
    if (response.status !== 201) {
      throw new Error("Lỗi khi thêm sản phẩm.");
    }
    return response;
  }

  async updateProduct(productId, inputData, images) {
    if (images) {
      inputData.image = await uploadImage(images, inputData.productName, inputData.supplierId);
    }
    const response = await ProductService.updateProduct(productId, inputData);
    if (response.status !== 200) {
      throw new Error("Lỗi khi cập nhật sản phẩm.");
    }
    return response;
  }

  async deleteProduct(productId) {
    const response = await ProductService.deleteProduct(productId);
    if (response.status !== 200) {
      throw new Error("Lỗi khi xóa sản phẩm.");
    }
    return response;
  }
}

export default ProductReceiver;