import ProductService from "../Adapter/services/ProductService";
import { uploadImage } from "../../Utils/ImageUtils";

class AddProductCommand {
    constructor(inputData, images, setSnackbarMessage, setSnackbarSeverity, setOpenSnackbar, setOpen) {
        this.inputData = inputData;
        this.images = images;
        this.setSnackbarMessage = setSnackbarMessage;
        this.setSnackbarSeverity = setSnackbarSeverity;
        this.setOpenSnackbar = setOpenSnackbar;
        this.setOpen = setOpen;
    }

    async execute() {
        try {
            if (this.images) {
                this.inputData.image = await uploadImage(this.images, this.inputData.productName, this.inputData.supplierId);
            }
            const response = await ProductService.addProduct(this.inputData);
            if (response.status === 201) {
                this.setOpen(false);
                this.setSnackbarMessage("Thêm sản phẩm thành công!");
                this.setSnackbarSeverity("success");
            } else {
                throw new Error("Lỗi khi thêm sản phẩm.");
            }
        } catch (error) {
            this.setSnackbarMessage(error.message || "Lỗi khi thêm sản phẩm. Vui lòng thử lại.");
            this.setSnackbarSeverity("error");
        } finally {
            this.setOpenSnackbar(true);
        }
    }
}

export default AddProductCommand;
