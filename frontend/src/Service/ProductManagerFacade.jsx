// ProductManagerFacade.js
import ApiService from "./ApiService"; // Adjust the import path as needed
import axios from "axios";
import crypto from "crypto-js";

class ProductManagerFacade {
  // Fetch all products
  static async fetchProducts() {
    try {
      const products = await ApiService.getAllProduct();
      return Array.isArray(products) ? products : [];
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  // Fetch all categories
  static async fetchCategories() {
    try {
      const categories = await ApiService.getAllCategorys();
      return Array.isArray(categories) ? categories : [];
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  // Fetch all suppliers
  static async fetchSuppliers() {
    try {
      const suppliers = await ApiService.getAllSupplier();
      return Array.isArray(suppliers) ? suppliers : [];
    } catch (error) {
      throw new Error(`Failed to fetch suppliers: ${error.message}`);
    }
  }

  // Add a product with an optional image
  static async addProductWithImage(productData, imageFile) {
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile, `${productData.productName}-${productData.supplierId}`);
      }
      const productWithImage = { ...productData, image: imageUrl };
      const response = await ApiService.addProduct(productWithImage);
      return response;
    } catch (error) {
      throw new Error(`Failed to add product: ${error.message}`);
    }
  }

  // Update a product with an optional image
  static async updateProductWithImage(productId, productData, imageFile) {
    try {
      let imageUrl = productData.image;
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile, `${productData.productName}-${productData.supplierId}`);
      }
      const productWithImage = { ...productData, image: imageUrl };
      const response = await ApiService.updateProduct(productId, productWithImage);
      return response;
    } catch (error) {
      throw new Error(`Failed to update product ${productId}: ${error.message}`);
    }
  }

  // Delete a product and refresh the list
  static async deleteAndRefresh(productId) {
    try {
      const deleteResponse = await ApiService.deleteProduct(productId);
      const updatedProducts = await this.fetchProducts();
      return { deleteResponse, updatedProducts };
    } catch (error) {
      throw new Error(`Failed to delete product ${productId}: ${error.message}`);
    }
  }

  // Handle Cloudinary image upload and deletion
  static async uploadImage(imageFile, publicId) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = crypto.SHA1(`public_id=${publicId}&timestamp=${timestamp}Mn2a9bePfKtrHY9Z3q0T_48-YuM`).toString();

    try {
      // Delete existing image if it exists
      await axios.post(
        "https://api.cloudinary.com/v1_1/dsygvdfd2/image/destroy",
        {
          public_id: publicId,
          signature: signature,
          api_key: "291288338413912",
          api_secret: "Mn2a9bePfKtrHY9Z3q0T_48-YuM",
          timestamp: timestamp,
        }
      ).catch(error => {
        console.warn("No existing image to delete or error:", error.response?.data || error.message);
      });

      // Upload new image
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "phatwarehouse");
      formData.append("public_id", publicId);

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dsygvdfd2/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
}

export default ProductManagerFacade;