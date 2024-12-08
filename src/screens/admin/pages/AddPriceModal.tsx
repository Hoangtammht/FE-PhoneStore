import { Modal, Form, Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import ProductHandleApi from "apis/ProductHandleApi";

interface AddPriceModalProps {
    visible: boolean;
    onClose: () => void;
    productID: string;
}

const AddPriceModal: React.FC<AddPriceModalProps> = ({ visible, onClose, productID }) => {
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await ProductHandleApi("/api/product/uploadImage", formData, "post");

            if (response.status === 200) {
                const uploadedImageUrl = response.data;
                setPreviewImage(uploadedImageUrl);
                message.success("Hình ảnh đã tải lên thành công!");
            } else {
                message.error("Lỗi khi tải lên hình ảnh!");
            }
        } catch (error) {
            message.error("Có lỗi khi tải lên hình ảnh!");
        }

        return false;
    };

    const handleSubmit = async (values: any) => {
        try {
            const productColorID = crypto.randomUUID();
            const variantID = crypto.randomUUID();

            const payload = {
                ...values,
                variantID,
                productColorID,
                productID,
                imagePath: previewImage,
            };

            const response = await ProductHandleApi("/api/product/addPriceForProduct", payload, "post");

            if (response.status === 200) {
                message.success("Thêm giá tiền thành công!");
                form.resetFields();
                setPreviewImage(null);
                onClose();
            } else {
                message.error("Đã xảy ra lỗi khi thêm giá tiền!");
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi khi thêm giá tiền!");
        }
    };

    return (
        <Modal
            title="Thêm giá tiền"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={{
                    productStorageID: 1,
                    colorName: "",
                    price: 0,
                }}
            >
                <Form.Item
                    name="productStorageID"
                    label="Dung lượng"
                    rules={[{ required: true, message: "Chọn dung lượng!" }]}
                >
                    <Select>
                        <Select.Option value={1}>64GB</Select.Option>
                        <Select.Option value={2}>128GB</Select.Option>
                        <Select.Option value={3}>256GB</Select.Option>
                        <Select.Option value={4}>512GB</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="colorName"
                    label="Màu sắc"
                    rules={[{ required: true, message: "Nhập màu sắc!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Giá tiền"
                    rules={[{ required: true, message: "Nhập giá tiền!" }]}
                >
                    <Input
                        type="text"
                        onChange={(e) => {
                            const inputValue = e.target.value.replace(/,/g, "");
                            if (!isNaN(Number(inputValue))) {
                                form.setFieldsValue({
                                    price: new Intl.NumberFormat().format(Number(inputValue)),
                                });
                            }
                        }}
                        onBlur={(e) => {
                            const inputValue = e.target.value.replace(/,/g, "");
                            if (!isNaN(Number(inputValue))) {
                                form.setFieldsValue({ price: Number(inputValue) });
                            }
                        }}
                    />
                </Form.Item>


                <Form.Item
                    label="Hình ảnh"
                    rules={[{ required: true, message: "Chọn hình ảnh minh họa!" }]}>
                    <Upload
                        beforeUpload={handleUpload}
                        showUploadList={false}>

                        <Button icon={<UploadOutlined />}>Chọn và tải hình ảnh</Button>
                    </Upload>

                    {previewImage && <img src={previewImage} alt="preview" style={{ width: '30%', marginTop: 10 }} />}
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Thêm giá tiền
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddPriceModal;
