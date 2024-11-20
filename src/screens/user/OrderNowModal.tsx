import { useState } from "react";
import { Modal, Button, Input, Form, message, Spin } from "antd";
import ProductHandleApi from "../../apis/ProductHandleApi";
import { LoadingOutlined } from "@ant-design/icons";
import './ProductDetail.css'
import { v4 as uuidv4 } from 'uuid';

const generateUniqueID = () => {
    return uuidv4();
};

const loadingIcon = <LoadingOutlined style={{ fontSize: 36, color: "#f56c6c" }} spin />;


interface ColorOption {
    productColorID: number;
    colorName: string;
    price: number;
    imagePath: string;
    colorHex: string;
}

interface StorageOption {
    productStorageID: number;
    storageCapacity: string;
}

interface Product {
    productID: number;
    categoryID: number;
    productName: string;
    image: string;
    description: string;
    price: number;
    stock: number;
    status: number;
}

interface OrderNowModalProps {
    isVisible: boolean;
    onClose: () => void;
    product: Product | null;
    colorOptions: ColorOption[];
    storages: StorageOption[];
    selectedColor: string;
    selectedStorage: string;
    selectedColorID: number;
    selectedStorageID: number;
    setSelectedColor: (color: string) => void;
    setSelectedStorage: (storage: string) => void;
    setSelectedColorID: (colorID: number) => void;
    setSelectedStorageID: (storageID: number) => void;
    variantID: number | undefined;
    onSubmit: (formData: {
        name: string;
        phone: string;
        message: string;
        color: string;
        storage: string;
        colorID: number;
        storageID: number;
    }) => void;
    price: number | undefined;
}


const formatPrice = (price: number | undefined) => {
    if (price === undefined || isNaN(price)) {
        return '0';
    }
    return new Intl.NumberFormat('vi-VN').format(price);
};

const OrderNowModal: React.FC<OrderNowModalProps> = ({
    isVisible,
    onClose,
    product,
    colorOptions,
    storages,
    selectedColor,
    setSelectedColor,
    selectedStorage,
    setSelectedStorage,
    selectedColorID,
    setSelectedColorID,
    selectedStorageID,
    setSelectedStorageID,
    price,
    variantID,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleFormChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleFormSubmit = async () => {
        setIsLoading(true); 
        const customerID = generateUniqueID()
        const orderID = generateUniqueID(); 
        const orderDetailID = generateUniqueID();

        const orderData = {
            fullName: formData.name,
            phone: formData.phone,
            priceAtOrder: price,
            variantID: variantID,
            productID: product?.productID || 0,
            totalAmount: price,
            customerID: customerID,
            orderID: orderID, 
            orderDetailID: orderDetailID,
        };

        try {
            const response = await ProductHandleApi(`/api/product/createOrder`, orderData, 'post');

            if (response.status === 200) {
                message.success('Bạn đã đặt hàng thành công, chúng tôi sẽ sớm liên hệ với bạn. Xin cảm ơn!');

                onSubmit({
                    ...formData,
                    color: selectedColor,
                    storage: selectedStorage,
                    colorID: selectedColorID,
                    storageID: selectedStorageID,
                });

                onClose();
            } else {
                message.error('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error creating order:', error);
        }finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title={`Đặt hàng - ${product?.productName}`}
            visible={isVisible}
            onCancel={onClose}
            footer={[
                <Button
                    key="cancel"
                    onClick={onClose}
                    style={{ width: "45%" }}
                    size="large"
                    disabled={isLoading}
                >
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleFormSubmit}
                    style={{ width: "45%" }}
                    size="large"
                    disabled={isLoading}
                >
                    {isLoading ? <Spin indicator={loadingIcon} /> : "Đặt hàng"}
                </Button>,
            ]}
            centered
            width={600}
            className="order-modal"
        >
            <div className="modal-content">
                {isLoading && (
                    <div className="loading-message flex flex-col items-center justify-center h-40">
                        <Spin indicator={loadingIcon} />
                        <p className="mt-4 text-lg text-gray-600">
                            Đang xử lý đơn hàng của bạn... Xin vui lòng đợi!
                        </p>
                    </div>
                )}

                {!isLoading && (
                    <>
                        <h3 className="text-lg font-semibold mb-4">Chọn dung lượng</h3>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {storages.map((storage) => (
                                <Button
                                    key={storage.productStorageID}
                                    type={selectedStorage === storage.storageCapacity ? "primary" : "default"}
                                    onClick={() => {
                                        setSelectedStorage(storage.storageCapacity);
                                        setSelectedStorageID(storage.productStorageID);
                                    }}
                                    className={`w-full flex justify-between ${
                                        selectedStorage === storage.storageCapacity
                                            ? "bg-orange-500 text-white hover:bg-orange-600"
                                            : "hover:bg-orange-100"
                                    }`}
                                >
                                    {storage.storageCapacity}
                                </Button>
                            ))}
                        </div>

                        <h3 className="text-lg font-semibold mb-4">Chọn màu sắc</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {colorOptions.map((color) => (
                                <Button
                                    key={color.colorName}
                                    type={selectedColor === color.colorName ? "primary" : "default"}
                                    onClick={() => {
                                        setSelectedColor(color.colorName);
                                        setSelectedColorID(color.productColorID);
                                    }}
                                    className={`w-full flex justify-between ${
                                        selectedColor === color.colorName
                                            ? "bg-orange-500 text-white hover:bg-orange-600"
                                            : "hover:bg-orange-100"
                                    }`}
                                >
                                    <span>{color.colorName}</span>
                                </Button>
                            ))}
                        </div>

                        <div className="price-container text-2xl font-bold text-red-600 mb-6">
                            <span>{formatPrice(price)} đ</span>
                        </div>

                        <Form layout="vertical">
                            <Form.Item label="Họ và tên" required>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleFormChange("name", e.target.value)}
                                    placeholder="Nhập họ và tên"
                                    className="rounded-lg shadow-sm"
                                />
                            </Form.Item>

                            <Form.Item label="Số điện thoại" required>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const phone = e.target.value.replace(/[^0-9]/g, "");
                                        if (phone.length <= 10) {
                                            handleFormChange("phone", phone);
                                        }
                                    }}
                                    placeholder="Nhập số điện thoại"
                                    className="rounded-lg shadow-sm"
                                    maxLength={10}
                                    type="tel"
                                />
                            </Form.Item>

                            <Form.Item label="Lời nhắn (tùy chọn)">
                                <Input
                                    value={formData.message}
                                    onChange={(e) => handleFormChange("message", e.target.value)}
                                    placeholder="Nhập lời nhắn"
                                    className="rounded-lg shadow-sm"
                                />
                            </Form.Item>
                        </Form>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default OrderNowModal;
