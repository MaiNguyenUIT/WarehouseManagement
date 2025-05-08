// ExportManagerFacade.js
import ApiService from "./ApiService"; // Adjust the import path as needed

class ExportManagerFacade {
  // Fetch all export shipments
  static async fetchShipments() {
    try {
      const shipments = await ApiService.getAllExport();
      return Array.isArray(shipments) ? shipments : [];
    } catch (error) {
      throw new Error(`Failed to fetch shipments: ${error.message}`);
    }
  }

  // Fetch order details by order code
  static async fetchOrderDetails(orderCode) {
    try {
      const orderDetails = await ApiService.getOrderByOrderCode(orderCode);
      return orderDetails.data || {};
    } catch (error) {
      throw new Error(`Failed to fetch order details for ${orderCode}: ${error.message}`);
    }
  }

  // Delete a shipment and refresh the list
  static async deleteAndRefresh(shipmentId) {
    try {
      const deleteResponse = await ApiService.deleteExport(shipmentId);
      const updatedShipments = await this.fetchShipments();
      return { deleteResponse, updatedShipments };
    } catch (error) {
      throw new Error(`Failed to delete shipment ${shipmentId}: ${error.message}`);
    }
  }

  // Add a shipment and refresh the list
  static async addAndRefresh(shipmentData) {
    try {
      const addResponse = await ApiService.addExport(shipmentData);
      const updatedShipments = await this.fetchShipments();
      return { addResponse, updatedShipments };
    } catch (error) {
      throw new Error(`Failed to add shipment: ${error.message}`);
    }
  }

  // Update a shipment and refresh the list
  static async updateAndRefresh(shipmentId, shipmentData) {
    try {
      const updateResponse = await ApiService.updateExport(shipmentId, shipmentData);
      const updatedShipments = await this.fetchShipments();
      return { updateResponse, updatedShipments };
    } catch (error) {
      throw new Error(`Failed to update shipment ${shipmentId}: ${error.message}`);
    }
  }

  // Fetch available orders (filtered by OUT_EXPORT status)
  static async fetchAvailableOrders() {
    try {
      const orders = await ApiService.getAllOrders();
      return Array.isArray(orders) ? orders.filter(order => order.orderStatus === "OUT_EXPORT") : [];
    } catch (error) {
      throw new Error(`Failed to fetch available orders: ${error.message}`);
    }
  }

  // Fetch details for multiple order codes
  static async fetchOrderDetailsByCodes(orderCodes) {
    try {
      const orderDetails = await Promise.all(
        orderCodes.map(async (orderCode) => {
          const response = await ApiService.getOrderByOrderCode(orderCode);
          return response.data || null;
        })
      );
      return orderDetails.filter(order => order !== null);
    } catch (error) {
      throw new Error(`Failed to fetch order details: ${error.message}`);
    }
  }

  // Create a new export shipment
  static async createExportShipment(shipmentData) {
    try {
      const addResponse = await ApiService.addExport(shipmentData);
      return addResponse;
    } catch (error) {
      throw new Error(`Failed to create shipment: ${error.message}`);
    }
  }

  // Update an export shipment (handles both full updates and state changes)
  static async updateExportShipment(shipmentId, shipmentData, isStateOnly = false) {
    try {
      const updateResponse = isStateOnly
        ? await ApiService.updateExportState(shipmentId, { exportState: shipmentData.exportState })
        : await ApiService.updateExport(shipmentId, shipmentData);
      return updateResponse;
    } catch (error) {
      throw new Error(`Failed to update shipment ${shipmentId}: ${error.message}`);
    }
  }

  // Update order status when removing from shipment
  static async removeOrderFromShipment(orderCode) {
    try {
      const response = await ApiService.getOrderByOrderCode(orderCode);
      const orderId = response.data.id;
      const formData = { orderStatus: "OUT_EXPORT" };
      await ApiService.updateOrderStatus(orderId, formData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update order status for ${orderCode}: ${error.message}`);
    }
  }
}

export default ExportManagerFacade;