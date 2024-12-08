import { Modal, Form, Input, Button, message } from "antd";
import { useState } from "react";
import ProductHandleApi from "apis/ProductHandleApi";

interface AddSpecificationModalProps {
  visible: boolean;
  onClose: () => void;
  productID: string;
}

const AddSpecificationModal: React.FC<AddSpecificationModalProps> = ({ visible, onClose, productID }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        productID,
        specName: values.specName,
        specValue: values.specValue,
      };

      const response = await ProductHandleApi("/api/product/addSpecificationForProduct", payload, "post");

      if (response.status === 200) {
        message.success("Thêm thông số kỹ thuật thành công!");
        form.resetFields();
        onClose();
      } else {
        message.error("Đã xảy ra lỗi khi thêm thông số kỹ thuật!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thêm thông số kỹ thuật!");
    }
  };

  return (
    <Modal
      title="Thêm thông số kỹ thuật"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          specName: "",
          specValue: "",
        }}
      >
        <Form.Item
          name="specName"
          label="Tên thông số"
          rules={[{ required: true, message: "Nhập tên thông số!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="specValue"
          label="Giá trị thông số"
          rules={[{ required: true, message: "Nhập giá trị thông số!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm thông số kỹ thuật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSpecificationModal;
