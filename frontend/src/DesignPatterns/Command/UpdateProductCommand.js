import ProductCommand from "./ProductCommand";

class UpdateProductCommand extends ProductCommand {
  constructor(
    receiver,
    productId,
    inputData,
    images,
    setSnackbarMessage,
    setSnackbarSeverity,
    setOpenSnackbar,
    setOpenEdit
  ) {
    super(receiver);
    this.productId = productId;
    this.inputData = inputData;
    this.images = images;
    this.setSnackbarMessage = setSnackbarMessage;
    this.setSnackbarSeverity = setSnackbarSeverity;
    this.setOpenSnackbar = setOpenSnackbar;
    this.setOpenEdit = setOpenEdit;
  }

  async execute() {
    try {
      await this.receiver.updateProduct(
        this.productId,
        this.inputData,
        this.images
      );
      this.setOpenEdit(false);
      this.setSnackbarMessage("Cập nhật sản phẩm thành công!");
      this.setSnackbarSeverity("success");
    } catch (error) {
      this.setSnackbarMessage(
        error.message || "Lỗi khi cập nhật sản phẩm. Vui lòng thử lại."
      );
      this.setSnackbarSeverity("error");
    } finally {
      this.setOpenSnackbar(true);
    }
  }
}

export default UpdateProductCommand;
