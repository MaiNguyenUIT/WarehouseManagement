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
  }

  async execute() {
    try {
      await this.receiver.addProduct(this.inputData, this.images);
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
}

export default AddProductCommand;