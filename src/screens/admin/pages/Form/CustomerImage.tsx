import { useEffect, useState } from "react";
import { Table, Button, message, Modal, Upload, Tag } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProductHandleApi from "apis/ProductHandleApi";

interface CustomerImage {
  customerImageID: number;
  imageURL: string;
  createdAt: string;
}

const CustomerImage = () => {
  const [customerImages, setCustomerImages] = useState<CustomerImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomerImages();
  }, []);

  const fetchCustomerImages = () => {
    setLoading(true);
    ProductHandleApi(`/api/product/getCustomerVisitImage`, {}, "get")
      .then((response) => {
        setCustomerImages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer images:", error);
        message.error("Không thể tải hình ảnh khách hàng!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteCustomerImage = (customerImageID: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa hình ảnh này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        await ProductHandleApi(
          `/api/product/deleteCustomerImage?customerImageID=${customerImageID}`,
          {},
          "delete"
        )
          .then(() => {
            message.success("Xóa hình ảnh thành công!");
            fetchCustomerImages();
          })
          .catch((error) => {
            console.error("Error deleting customer image:", error);
            message.error("Xóa hình ảnh thất bại!");
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  const showCreateCustomerImageModal = () => {
    setImagePreview(null);
    setIsModalVisible(true);
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await ProductHandleApi("/api/product/uploadImage", formData, "post");

      if (response.status === 200) {
        const uploadedImageUrl = response.data;
        setImagePreview(uploadedImageUrl);
        message.success("Hình ảnh đã tải lên thành công!");
      } else {
        message.error("Lỗi khi tải lên hình ảnh!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Có lỗi khi tải lên hình ảnh!");
    } finally {
      setLoading(false);
    }

    return false;
  };

  const handleCreateCustomerImage = async () => {
    if (!imagePreview) {
      message.warning("Vui lòng tải lên hình ảnh trước khi lưu!");
      return;
    }

    setLoading(true);
    try {
      const response = await ProductHandleApi(
        "/api/product/addCustomerImage",
        { imageURL: imagePreview },
        "post"
      );

      if (response.status === 200) {
        message.success("Thêm hình ảnh thành công!");
        fetchCustomerImages();
        setIsModalVisible(false);
      } else {
        message.error("Thêm hình ảnh thất bại!");
      }
    } catch (error) {
      console.error("Error creating customer image:", error);
      message.error("Thêm hình ảnh thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "imageURL",
      key: "imageURL",
      render: (imageURL: string) => (
        <img
          src={imageURL}
          alt="Customer"
          className="w-60 h-25 object-contain rounded-md"
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: CustomerImage) => (
        <Button
          type="primary"
          danger
          onClick={() => handleDeleteCustomerImage(record.customerImageID)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý hình ảnh khách hàng</h1>
        <p className="text-gray-600">
          Quản lý và hiển thị các hình ảnh ghi nhận từ khách hàng.
        </p>
      </div>

      <Button
        type="primary"
        onClick={showCreateCustomerImageModal}
        className="mb-6"
      >
        Thêm hình ảnh khách hàng
      </Button>

      <Table
        dataSource={customerImages}
        columns={columns}
        rowKey="customerImageID"
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
        }}
        bordered
        className="bg-white shadow-md rounded-lg"
      />

      <Modal
        title="Thêm hình ảnh khách hàng"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreateCustomerImage} loading={loading}>
            Lưu
          </Button>,
        ]}
      >
        <Upload
          beforeUpload={handleUpload}
          showUploadList={false}
          className="mb-4"
        >
          <Button icon={<UploadOutlined />}>Chọn và tải lên hình ảnh</Button>
        </Upload>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-40 h-24 object-contain rounded-md shadow-md mt-4"
          />
        )}
      </Modal>
    </div>
  );
};

export default CustomerImage;
