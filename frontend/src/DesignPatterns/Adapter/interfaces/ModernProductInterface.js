// Interface mà client mong đợi
export default class ModernProductInterface {
  async getAllProducts() {
    throw new Error("Method must be implemented");
  }

  async getProductById(id) { // eslint-disable-line no-unused-vars
    throw new Error("Method must be implemented");
  }

  async addProduct(productData) { // eslint-disable-line no-unused-vars
    throw new Error("Method must be implemented");
  }

  async updateProduct(id, productData) { // eslint-disable-line no-unused-vars
    throw new Error("Method must be implemented");
  }

  async deleteProduct(id) { // eslint-disable-line no-unused-vars
    throw new Error("Method must be implemented");
  }
}
