import { useEffect, useState } from "react";
import { Table, Tag, Button, message, Modal, Input, Upload, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProductHandleApi from "apis/ProductHandleApi";

interface BannerData {
  bannerID: number;
  imageUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Image preview URL
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    setLoading(true);
    ProductHandleApi(`/api/product/getBanner`)
      .then((response) => {
        const activeBanners = response.data.filter((banner: BannerData) => banner.active);
        setBanners(activeBanners);
      })
      .catch((error) => {
        console.error("Error fetching banners:", error);
        message.error("Không thể tải dữ liệu banner!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteBanner = (bannerID: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa banner này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        await ProductHandleApi(`/api/product/deleteBanner?bannerID=${bannerID}`, {}, "delete")
          .then(() => {
            message.success("Xóa banner thành công!");
            fetchBanners();
          })
          .catch((error) => {
            console.error("Error deleting banner:", error);
            message.error("Xóa banner thất bại!");
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  const showCreateBannerModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCreateBanner = async (values: any) => {
    setLoading(true);

    const newBanner = {
      description: values.description,
      imageUrl: imagePreview,
    };

    try {
      const response = await ProductHandleApi("/api/product/addBanner", newBanner, "post");

      if (response.status === 200) {
        message.success("Tạo banner thành công!");
        fetchBanners();
        setIsModalVisible(false);
      } else {
        message.error("Tạo banner thất bại!");
      }
    } catch (error) {
      message.error("Tạo banner thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
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
      message.error("Có lỗi khi tải lên hình ảnh!");
    } finally {
      setLoading(false);
    }

    return false;
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl: string) => (
        <img
          src={imageUrl}
          alt="Banner"
          className="w-60 h-25 object-contain rounded-md"
        />
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: BannerData) => (
        <Button
          type="primary"
          danger
          onClick={() => handleDeleteBanner(record.bannerID)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center md:text-left">
          Quản lý Banner
        </h1>
        <p className="text-gray-600 text-center md:text-left">
          Quản lý và hiển thị các banner quảng cáo của bạn.
        </p>
      </div>

      <div className="flex justify-center md:justify-start mb-6">
        <Button
          type="primary"
          onClick={showCreateBannerModal}
          className="w-full md:w-auto"
        >
          Tạo Banner
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={banners}
          columns={columns}
          rowKey="bannerID"
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
          }}
          bordered
          className="bg-white shadow-md rounded-lg"
          scroll={{
            x: 800,
          }}
        />
      </div>

      <Modal
        title="Tạo Banner Mới"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        className="max-w-full md:max-w-lg"
      >
        <Form form={form} onFinish={handleCreateBanner} layout="vertical">
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Nhập mô tả banner!" }]}
          >
            <Input placeholder="Nhập mô tả banner" />
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            rules={[{ required: true, message: "Vui lòng tải hình ảnh!" }]}
          >
            <Upload beforeUpload={handleUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Chọn và tải hình ảnh</Button>
            </Upload>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="w-1/3 mx-auto mt-3"
              />
            )}
          </Form.Item>

          {/* Nút submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Tạo Banner
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerManagement;
