import ProductService from "../Adapter/services/ProductService";
import { uploadImage } from "../../Utils/ImageUtils";

class UpdateProductCommand {
    constructor(productId, inputData, images, setSnackbarMessage, setSnackbarSeverity, setOpenSnackbar, setOpenEdit) {
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
            if (this.images) {
                this.inputData.image = await uploadImage(this.images, this.inputData.productName, this.inputData.supplierId);
            }
            const response = await ProductService.updateProduct(this.productId, this.inputData);
            if (response.status === 200) {
                this.setOpenEdit(false);
                this.setSnackbarMessage("Cập nhật sản phẩm thành công!");
                this.setSnackbarSeverity("success");
            } else {
                throw new Error("Lỗi khi cập nhật sản phẩm.");
            }
        } catch (error) {
            this.setSnackbarMessage(error.message || "Lỗi khi cập nhật sản phẩm. Vui lòng thử lại.");
            this.setSnackbarSeverity("error");
        } finally {
            this.setOpenSnackbar(true);
        }
    }
}

export default UpdateProductCommand;
