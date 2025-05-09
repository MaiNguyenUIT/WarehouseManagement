import ProductService from "../Adapter/services/ProductService";

class DeleteProductCommand {
    constructor(productId, setSnackbarMessage, setSnackbarSeverity, setOpenSnackbar) {
        this.productId = productId;
        this.setSnackbarMessage = setSnackbarMessage;
        this.setSnackbarSeverity = setSnackbarSeverity;
        this.setOpenSnackbar = setOpenSnackbar;
    }

    async execute() {
        try {
            await ProductService.deleteProduct(this.productId);
            this.setSnackbarMessage("Xóa sản phẩm thành công!");
            this.setSnackbarSeverity("success");
        } catch (error) {
            this.setSnackbarMessage(error.message || "Lỗi khi xóa sản phẩm. Vui lòng thử lại.");
            this.setSnackbarSeverity("error");
        } finally {
            this.setOpenSnackbar(true);
        }
    }
}

export default DeleteProductCommand;
