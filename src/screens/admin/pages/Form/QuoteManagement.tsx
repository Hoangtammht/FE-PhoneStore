import { useEffect, useState } from "react";
import { Card, Col, Row, message, Select, Spin, Button, Modal, Form, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProductHandleApi from "apis/ProductHandleApi";

const { Option } = Select;

interface Quote {
  quoteID: number;
  quoteCategory: string;
  imageUrl: string;
}

function QuoteManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await ProductHandleApi(`/api/product/getListQuote`, {}, "get");
      setQuotes(response.data);
    } catch (error) {
      message.error("Không thể tải dữ liệu báo giá!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuote = async (values: { quoteCategory: string }) => {
    if (!imagePreview) {
      message.warning("Vui lòng tải lên hình ảnh trước!");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...values, imageUrl: imagePreview };
      const response = await ProductHandleApi(`/api/product/insertQuote`, payload, "post");
      setQuotes((prev) => [...prev, { ...payload, quoteID: response.data.quoteID }]);
      message.success("Thêm báo giá thành công!");
      form.resetFields();
      setImagePreview(null);
      setIsModalVisible(false);
    } catch (error) {
      message.error("Không thể thêm báo giá!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuote = async (quoteID: number) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn xóa báo giá này?",
      onOk: async () => {
        setLoading(true);
        try {
          await ProductHandleApi(`/api/product/deleteQuote?quoteID=${quoteID}`, {  }, "delete");
          setQuotes((prev) => prev.filter((quote) => quote.quoteID !== quoteID));
        } catch (error) {
          message.error("Không thể xóa báo giá!");
        } finally {
          setLoading(false);
        }
      },
    });
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

  const filteredQuotes = filter === "all" ? quotes : quotes.filter((q) => q.quoteCategory === filter);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">Quản lý báo giá</h1>
      <div className="flex justify-between items-center mb-6">
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={(value) => setFilter(value)}
        >
          <Option value="all">Tất cả loại</Option>
          <Option value="Iphone">Iphone</Option>
          <Option value="Samsung">Samsung</Option>
          <Option value="Vivo">Vivo</Option>
        </Select>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Thêm báo giá
        </Button>
      </div>
      <div className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredQuotes.map((quote) => (
              <Col xs={24} sm={12} md={8} lg={6} key={quote.quoteID}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={quote.quoteCategory}
                      src={quote.imageUrl}
                      className="object-contain h-48 w-full"
                    />
                  }
                  actions={[
                    <Button type="link" danger onClick={() => handleDeleteQuote(quote.quoteID)}>
                      Xóa
                    </Button>,
                  ]}
                >
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Modal
        title="Thêm báo giá"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddQuote}
        >
          <Form.Item
            label="Loại báo giá"
            name="quoteCategory"
            rules={[{ required: true, message: "Vui lòng chọn loại báo giá!" }]}
          >
            <Select placeholder="Chọn loại báo giá">
              <Option value="Iphone">Iphone</Option>
              <Option value="Samsung">Samsung</Option>
              <Option value="Vivo">Vivo</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Hình ảnh"
            rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
          >
            <Upload
              name="image"
              accept="image/*"
              customRequest={({ file }) => handleUpload(file as File)}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-full h-48 object-contain"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default QuoteManagement;
