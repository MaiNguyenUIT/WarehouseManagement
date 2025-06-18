// Giả lập một Legacy API service với interface khác
export default class LegacyProductAPI {
  static async getProducts() {
    // Giả lập legacy API trả về data với format khác
    return {
      success: true,
      items: [
        {
          prod_id: 1,
          prod_name: "Sample Product",
          cat_id: 1,
          sup_id: 1,
          qty: 100,
          prod_unit: "pcs",
          prod_price: 25000,
          create_date: "2024-01-01",
          expire_date: "2024-12-31",
          status: "AVAILABLE",
          desc: "Sample description",
          img: null
        }
      ]
    };
  }

  static async createProduct(productData) {
    // Legacy API expects different field names
    const legacyData = {
      prod_name: productData.name,
      cat_id: productData.category,
      sup_id: productData.supplier,
      qty: productData.quantity,
      prod_unit: productData.unit,
      prod_price: productData.price,
      create_date: productData.productionDate,
      expire_date: productData.expirationDate,
      status: productData.status,
      desc: productData.description,
      img: productData.image
    };

    return {
      success: true,
      created_id: Math.floor(Math.random() * 1000),
      data: legacyData
    };
  }
}
