import axios from "axios";

export default class ApiService {

    static BASE_URL = "http://localhost:6060";
    
    // static BASE_URL = "http://localhost:6060";
    // Từ
    static getHeader() {
        const token = localStorage.getItem("jwt");  
        if (!token) {
            throw new Error("Token không tồn tại trong localStorage.");  
        }
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }
    static async loginUser(loginDetails) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/signin`, loginDetails);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async changePass(formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/auth/changePass`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }

    static async logout() {
        try {
            const response = await axios.post(
                `${this.BASE_URL}/auth/logout`,
                {}, 
                { headers: this.getHeader() } 
            );

            localStorage.removeItem("jwt");
            localStorage.removeItem("role");

            return response.data; 
        } catch (error) {
            throw error; 
        }
    }
    
    static async getAllInventory() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/inventory`, {
                headers: this.getHeader()  
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getSingleInventory(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/inventory/${id}`, {
                headers: this.getHeader()  
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }


    static async getSingleProduct(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/product/getById/${id}`, {
                headers: this.getHeader()  
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    

    static async getAllQuantityProduct(){
        try {
            const response = await axios.get(`${this.BASE_URL}/api/admin/order/getOrderQuantity`, {
                headers: this.getHeader()  
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async addInventory(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/admin/inventory`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }


    
    

    static async deleteInventory(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/admin/inventory/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi xóa:", error.response?.data || error.message);
            throw error;
        }
    }

    static async updateInventory(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/admin/inventory/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }

    static async getAllShelf() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/shelf/all`, {
                headers: this.getHeader()  
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }


    static async getInforUser(){
        try {
            const response = await axios.get(`${this.BASE_URL}/api/getInformation`, {
                headers: this.getHeader()  
            });
            return response.data;
        } catch (error) {   
            throw error;
        }
    }

    static async addShelf(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/shelf`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }
    static async deleteShelf(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/shelf/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi xóa:", error.response?.data || error.message);
            throw error;
        }
    }

    static async updateShelf(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/shelf/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }

    // static async searchShelf(keyword) {
    //     try {
    //       const response = await axios.get(`${this.BASE_URL}/api/shelf/searchByName/${keyword}`, {
    //         headers: this.getHeader(),
    //             'Content-Type': 'application/json' 
    //       });
    //       return response.data;  
    //     } catch (error) {
    //         console.error("Lỗi khi tìm kiếm:", error.response?.data || error.message);
    //         throw error;
    //     }
    // }

    static async searchInventory(keyword) {
        try {
          const response = await axios.get(`${this.BASE_URL}/api/inventory/searchByName/${keyword}`, {
            headers: this.getHeader(),
                'Content-Type': 'application/json' 
          });
          return response.data;  
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error.response?.data || error.message);
            throw error;
        }
    }

    static async updateInforUser(formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/updateInfor`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }
    // static async uploadImage(formData) {
    //     try {
    //         const response = await axios.post(`${this.BASE_URL}/upload/image`, formData, {
    //             headers: this.getHeader(),
    //             'Content-Type': 'multipart/form-data' 
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw error;  
    //     }
    // }

    static async uploadImage(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/upload/image`, formData, {
                // headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }




    static async addReport(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/report`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }

    static async getAllReport() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/admin/report`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async updateReport(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/report/updateReport/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }

    static async getAllReportOrStaff() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/report`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    


    

    // Phát
    
    //Product
    static async getAllProduct() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/product`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async addProduct(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/product`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response;
        } catch (error) {
            throw error;  
        }
    }

    static async updateProduct(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/product/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response;
        } catch (error) {
            throw error;  
        }
    }

    static async deleteProduct(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/product/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi xóa:", error.response?.data || error.message);
            throw error;
        }
    }
    
    static async getProductBySupplierName(supplierName) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/product/getBySupplier/${supplierName}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    
    // static async getProductById(id) {
    //     try {
    //         const response = await axios.get(`${this.BASE_URL}/api/product/getById/${id}`, {
    //             headers: this.getHeader(),
    //         });
    //         return response.data; 
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    static async getAllCategories() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/category`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getCategoryById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/category/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            throw error;
        }
    }
    
    //Supplier
    static async getAllSupplier() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/supplier`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async addSupplier(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/admin/supplier`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response;
        } catch (error) {
            throw error;  
        }
    }

    static async updateSupplier(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/admin/supplier/updateSupplier/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response;
        } catch (error) {
            throw error;  
        }
    }

    static async getSupplierById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/supplier/getById/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            throw error;
        }
    }

    static async deleteSupplier(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/admin/supplier/${id}`, {
                headers: this.getHeader(),
            });
            return response; 
        } catch (error) {
            console.error("Lỗi khi xóa:", error.response?.data || error.message);
            throw error;
        }
    }

    //ImportShipments
    static async getAllImportShipments() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/importshipments`, {
                headers: this.getHeader()
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async addImportShipment(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/admin/importshipments`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json'
            });
            return response;
        } catch (error) {
            throw error;  
        }
    }

    static async updateImportShipment(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/admin/importshipments/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response;
        } catch (error) {
            throw error;  
        }
    }

    static async deleteImportShipment(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/admin/importshipments/${id}`, {
                headers: this.getHeader(),
            });
            return response; 
        } catch (error) {
            console.error("Lỗi khi xóa:", error.response?.data || error.message);
            throw error;
        }
    }

    //ImportShipmentItems

    static async getImportShipmentItemsById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/importShipmentItems/${id}`, {
                headers: this.getHeader(),
            });
            return response; 
        } catch (error) {
            throw error;
        }
    }

    static async addImportShipmentItems(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/admin/importShipmentItems`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json'
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    // Tân
    //order
    static async getAllOrders() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/admin/order`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }
    static async addOrder(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/order`, formData, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm gói hàng:", error.response?.data || error.message);
            throw error;
        }
    }
    static async updateOrder(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/order/updateOrder/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }
    static async updateOrderStatus(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/admin/order/updateOrderState/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }
    static async updateOrderState(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/admin/order/updateOrderStatus/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }
    static async getProduct() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/product`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error.response?.data || error.message);
            throw error;
        }
    }
    static async getNotification() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/product/notification`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sach thong bao:", error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteOrder(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/admin/order/deleteOrder/${id}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa đơn:", error.response?.data || error.message);
            throw error;
        }
    }
    static async getOrderById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/order/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi lấy thông tin:", error.response?.data || error.message);
            throw error;
        }
    }
    static async getUserrById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/getInformation/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi lấy thông tin:", error.response?.data || error.message);
            throw error;
        }
    }
    static async getOrderByOrderCode(code) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/order/getOrderByOrderCode/${code}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi lấy thông tin bằng code:", error.response?.data || error.message);
            throw error;
        }
    }

    static async searchShelf(keyword) {
        try {
          const response = await axios.get(`${this.BASE_URL}/api/shelf/searchByName/${keyword}`, {
            headers: this.getHeader(),
                'Content-Type': 'application/json' 
          });
          return response.data;  
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error.response?.data || error.message);
            throw error;
        }
    }
    static async getProductById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/product/getById/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi lấy thông tin:", error.response?.data || error.message);
            throw error;
        }
    }
    static async getProductByName(name) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/product/getByName/${name}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi lấy thông tin:", error.response?.data || error.message);
            throw error;
        }
    }
    static async getShelfByProductName(name) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/shelf/allShelfCode/${name}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi lấy thông tin kệ:", error.response?.data || error.message);
            throw error;
        }
    }
    
    //order items
    
    static async getOrderItemById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/admin/orderItem/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi lấy thông tin:", error.response?.data || error.message);
            throw error;
        }
    }
    static async getOrderItemByCode(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/orderItem/getOrderItemByOrderCode/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi lấy thông tin:", error.response?.data || error.message);
            throw error;
        }
    }
    static async addOrderItem(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/orderItem`, formData, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm gói hàng:", error.response?.data || error.message);
            throw error;
        }
    }
    static async updateOrderItem(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/orderItem/updateOrderItem/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }
    
    static async deleteOrderItem(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/orderItem/${id}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa orderitem:", error.response?.data || error.message);
            throw error;
        }
    }
    //employee
    static async getAllEmployees() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/admin/user/getAll`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }
    static async addEmployee(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/admin/user/createUserAccount`, formData, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }
    

    static async deleteEmployee(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/admin/user/${id}/delete`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }
    //Category
    static async getAllCategory() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/category`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách :", error.response?.data || error.message);
            throw error;
        }
    }
    static async addCategory(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/admin/category`, formData, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error.response?.data || error.message);
            throw error;
        }
    }   
    static async deleteCategory(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/admin/category/${id}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error.response?.data || error.message);
            throw error;
        }
    }
    //Export
    static async getAllExport() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/export`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách xuất:", error.response?.data || error.message);
            throw error;
        }
    }
    static async addExport(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/admin/export`, formData, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error.response?.data || error.message);
            throw error;
        }
    }   
    static async deleteExport(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/admin/export/${id}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error.response?.data || error.message);
            throw error;
        }
    }
    static async updateExport(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/admin/export/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }
    static async updateExportState(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/admin/export/updateExportStatus/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }
}