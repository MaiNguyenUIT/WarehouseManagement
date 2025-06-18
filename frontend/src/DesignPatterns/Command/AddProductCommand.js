import ProductCommand from "./ProductCommand";

class AddProductCommand extends ProductCommand {
  constructor(receiver, inputData, images, setSnackbarMessage, setSnackbarSeverity, setOpenSnackbar, setOpen) {
    super(receiver);
    this.inputData = inputData;
    this.images = images;
    this.setSnackbarMessage = setSnackbarMessage;
    this.setSnackbarSeverity = setSnackbarSeverity;
    this.setOpenSnackbar = setOpenSnackbar;
    this.setOpen = setOpen;
    this.createdProductId = null; // Lưu ID của product đã tạo để có thể undo
  }

  async execute() {
    try {
      const result = await this.receiver.addProduct(this.inputData, this.images);
      this.createdProductId = result.data?.id; // Lưu ID cho undo
      this.setOpen(false);
      this.setSnackbarMessage("Thêm sản phẩm thành công!");
      this.setSnackbarSeverity("success");
    } catch (error) {
      this.setSnackbarMessage(error.message || "Lỗi khi thêm sản phẩm. Vui lòng thử lại.");
      this.setSnackbarSeverity("error");
    } finally {
      this.setOpenSnackbar(true);
    }
  }

  async undo() {
    if (this.createdProductId) {
      try {
        await this.receiver.deleteProduct(this.createdProductId);
        this.setSnackbarMessage("Đã hoàn tác việc thêm sản phẩm!");
        this.setSnackbarSeverity("info");
        this.setOpenSnackbar(true);
      } catch (error) {
        this.setSnackbarMessage("Lỗi khi hoàn tác: " + error.message);
        this.setSnackbarSeverity("error");
        this.setOpenSnackbar(true);
      }
    }
  }

  canUndo() {
    return this.createdProductId !== null;
  }
}

export default AddProductCommand;