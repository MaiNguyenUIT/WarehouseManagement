import ProductCommand from "./ProductCommand";

class DeleteProductCommand extends ProductCommand {
  constructor(receiver, productId, setSnackbarMessage, setSnackbarSeverity, setOpenSnackbar) {
    super(receiver);
    this.productId = productId;
    this.setSnackbarMessage = setSnackbarMessage;
    this.setSnackbarSeverity = setSnackbarSeverity;
    this.setOpenSnackbar = setOpenSnackbar;
  }

  async execute() {
    try {
      await this.receiver.deleteProduct(this.productId);
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