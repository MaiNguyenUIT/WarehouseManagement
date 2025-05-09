import axios from "axios";
import crypto from "crypto-js";

export const uploadImage = async (image, productName, supplierId) => {
    const publicId = `${productName}-${supplierId}`;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = crypto.SHA1(`public_id=${publicId}&timestamp=${timestamp}Mn2a9bePfKtrHY9Z3q0T_48-YuM`).toString();

    try {
        await axios.post(
            'https://api.cloudinary.com/v1_1/dsygvdfd2/image/destroy',
            {
                public_id: publicId,
                signature: signature,
                api_key: '291288338413912',
                api_secret: 'Mn2a9bePfKtrHY9Z3q0T_48-YuM',
                timestamp: timestamp
            }
        );
    } catch (error) {
        console.warn('Không tìm thấy ảnh cũ hoặc lỗi khi xóa:', error.response?.data || error.message);
    }

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'phatwarehouse');
    formData.append('public_id', publicId);

    const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dsygvdfd2/image/upload',
        formData
    );

    return response.data.secure_url;
};
