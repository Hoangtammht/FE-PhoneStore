import React, { useState, useEffect } from "react";
import { Spin, Input, Select, Pagination, Modal, Button, Form, Upload, message, Table } from "antd";
import ProductHandleApi from "apis/ProductHandleApi";
import { v4 as uuidv4 } from 'uuid';
import { FileAddFilled, UploadOutlined } from '@ant-design/icons';
import AddPriceModal from './AddPriceModal';
import AddSpecificationModal from "./AddSpecificationModal";


const { Search } = Input;
const { Option } = Select;

interface IProduct {
  productID: string;
  categoryID: number;
  productName: string;
  image: string;
  description: string;
  price: number;
  status: number;
}

interface ProductContent {
  contentID: number;
  title: string;
  contentText: string;
  contentImage: string;
  displayOrder: number;
}

interface Specification {
  specificationID: number;
  specName: string;
  specValue: string;
}

interface PriceVariant {
  variantID: string;
  colorName: string;
  storageCapacity: string;
  imagePath: string | null;
  price: number;
}


const ProductManagement = () => {
  const [categoryID, setCategoryID] = useState(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedProductID, setSelectedProductID] = useState<string | null>(null);
  const [contentImagePreview, setContentImagePreview] = useState<string | null>(null);
  const [productContents, setProductContents] = useState<ProductContent[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isContentModalVisible, setIsContentModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProductContentModalVisible, setIsProductContentModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState<ProductContent | null>(null);
  const [form] = Form.useForm();
  const [contentForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [isModalAddPriceVisible, setIsAddPriceModalVisible] = useState(false);
  const [selectedAddPriceProductID, setAddPriceSelectedProductID] = useState<string | null>(null);
  const [selectedAddSpecProductID, setAddSpecSelectedProductID] = useState<string | null>(null);
  const [isAddSpecModalVisible, setIsAddSpecModalVisible] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [priceData, setPriceData] = useState<PriceVariant[]>([]);

  const handleOpenPriceModal = async (productID: string) => {
    setIsPriceModalVisible(true);
    try {
      const response = await ProductHandleApi(
        `/api/product/getListVariantByProductID?productID=${productID}`,
        {},
        "get"
      );

      if (response.status === 200) {
        setPriceData(response.data);
      } else {
        message.error("Không thể lấy dữ liệu giá tiền!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi lấy dữ liệu giá tiền!");
    }
  };

  const handleClosePriceModal = () => {
    setIsPriceModalVisible(false);
    setPriceData([]);
  };

  const handleOpen = async (productID: string) => {
    setIsVisible(true);
    try {
      const response = await ProductHandleApi(
        `/api/product/getSpecificationOfProduct?productID=${productID}`,
        {},
        "get"
      );

      if (response.status === 200) {
        setSpecifications(response.data);
      } else {
        message.error("Không thể lấy dữ liệu thông số kỹ thuật!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi lấy dữ liệu!");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDelete = async (specificationID: number) => {
    try {
      const response = await ProductHandleApi(
        `/api/product/deleteSpecificationForProduct?specificationID=${specificationID}`,
        {},
        "delete"
      );

      if (response.status === 200) {
        message.success("Xóa thông số kỹ thuật thành công!");
        setSpecifications((prev) =>
          prev.filter((spec) => spec.specificationID !== specificationID)
        );
      } else {
        message.error("Đã xảy ra lỗi khi xóa thông số kỹ thuật!");
      }
    } catch (error) {
      message.error("Không thể xóa thông số kỹ thuật!");
    }
  };

  const columns = [
    {
      title: "Tên thông số",
      dataIndex: "specName",
      key: "specName",
    },
    {
      title: "Giá trị",
      dataIndex: "specValue",
      key: "specValue",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Specification) => (
        <Button
          type="link"
          danger
          onClick={() => handleDelete(record.specificationID)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const dataColumns = [
    {
      title: "Dung lượng",
      dataIndex: "storageCapacity",
      key: "storageCapacity",
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: "Màu sắc",
      dataIndex: "colorName",
      key: "colorName",
    },
    {
      title: "Hình ảnh",
      dataIndex: "imagePath",
      key: "imagePath",
      render: (url: string | null) =>
        url ? <img src={url} alt="Product" style={{ width: 50, height: 50 }} /> : "Không có",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (price: number) => new Intl.NumberFormat("vi-VN").format(price) + " VND",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, item: PriceVariant) => (
        <Button
          type="primary"
          danger
          onClick={() => handleDeleteVariant(item.variantID)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const handleOpenSpecModal = (productID: string) => {
    setAddSpecSelectedProductID(productID);
    setIsAddSpecModalVisible(true);
  };

  const handleCloseSpecModal = () => {
    setIsAddSpecModalVisible(false);
  };


  const handleOpenModal = (productID: string) => {
    setAddPriceSelectedProductID(productID);
    setIsAddPriceModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsAddPriceModalVisible(false);
  };

  const fetchProducts = async (categoryID: number) => {
    setLoading(true);
    try {
      const response = await ProductHandleApi(
        `/api/product/getProductByCategoryID?categoryID=${categoryID}`,
        {},
        "get"
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(categoryID);
  }, [categoryID]);

  useEffect(() => {
    let updatedProducts = products;

    if (searchTerm.trim() !== "") {
      updatedProducts = updatedProducts.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      const statusValue = filterStatus === "inStock" ? 1 : 0;
      updatedProducts = updatedProducts.filter(
        (product) => product.status === statusValue
      );
    }

    setFilteredProducts(updatedProducts);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, products]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsExpanded(false);
    setSelectedProduct(null);
    setIsProductContentModalVisible(false)
    setProductContents([]);
  };

  const handleCreateProduct = async (values: any) => {

    const newProduct = {
      productID: uuidv4(),
      categoryID: values.categoryID,
      productName: values.productName,
      image: imagePreview,
      price: values.price,
    };

    try {
      const response = await ProductHandleApi(
        `/api/product/createProduct`,
        newProduct,
        "post"
      );
      if (response.status === 200) {
        fetchProducts(categoryID);
        setIsModalVisible(false);
        setImagePreview(null);
        message.success('Tạo sản phẩm thành công!');
      }
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const fetchProductContents = async (productId: string) => {
    try {
      const response = await ProductHandleApi(
        `/api/product/getProductContent?productID=${productId}`
      );
      const sortedContents = response.data.sort(
        (a: ProductContent, b: ProductContent) => a.displayOrder - b.displayOrder
      );
      setProductContents(sortedContents);
    } catch (error) {
      console.error("Failed to fetch product contents:", error);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await ProductHandleApi('/api/product/uploadImage', formData, 'post');

      if (response.status === 200) {
        const uploadedImageUrl = response.data;
        setImagePreview(uploadedImageUrl);
        message.success("Hình ảnh đã tải lên thành công!");
      } else {
        message.error("Lỗi khi tải lên hình ảnh!");
      }
    } catch (error) {
      message.error("Có lỗi khi tải lên hình ảnh!");
      console.error("Lỗi upload:", error);
    } finally {
      setLoading(false);
    }

    return false;
  };

  const handleAddContent = (productID: string) => {
    setSelectedProductID(productID);
    contentForm.resetFields();
    setContentImagePreview(null);
    setIsContentModalVisible(true);
  };

  const handleContentUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await ProductHandleApi('/api/product/uploadImage', formData, 'post');

      if (response.status === 200) {
        const uploadedImageUrl = response.data;
        setContentImagePreview(uploadedImageUrl);
        message.success("Hình ảnh đã tải lên thành công!");
      } else {
        message.error("Lỗi khi tải lên hình ảnh!");
      }
    } catch (error) {
      message.error("Có lỗi khi tải lên hình ảnh!");
      console.error("Lỗi upload:", error);
    } finally {
      setLoading(false);
    }

    return false;
  };

  const handleSubmitContent = async (values: any) => {
    const contentData = {
      contentImage: contentImagePreview,
      contentText: values.contentText,
      displayOrder: values.displayOrder,
      productID: selectedProductID,
      title: values.title,
    };

    try {
      const response = await ProductHandleApi('/api/product/insertProductContent', contentData, 'post');
      if (response.status === 200) {
        message.success('Nội dung đã được thêm thành công!');
        setIsContentModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to insert product content:", error);
      message.error("Có lỗi xảy ra khi thêm nội dung!");
    }
  };

  const handleProductContentClick = async (product: IProduct) => {
    await fetchProductContents(product.productID);
    setIsProductContentModalVisible(true);
  };

  useEffect(() => {
    if (editingContent) {
      editForm.setFieldsValue({
        title: editingContent?.title,
        contentText: editingContent?.contentText,
        contentImage: editingContent?.contentImage,
        displayOrder: editingContent?.displayOrder,
      });
    }
  }, [editingContent, form]);

  const handleEditProductContent = async (values: any) => {
    if (!editingContent) {
      message.error("Không xác định được nội dung cần chỉnh sửa.");
      return;
    }
    try {
      const updatedContent = {
        ...editingContent,
        ...values,
      };
      const response = await ProductHandleApi('/api/product/editProductContent', updatedContent, 'put');
      if (response.status === 200) {
        handleSuccessEdit();
      } else {
        handleErrorEdit();
      }
    } catch (error) {
      console.error("Failed to edit product content:", error);
      handleErrorEdit();
    }
  };

  const handleSuccessEdit = () => {
    message.success("Nội dung đã được chỉnh sửa thành công!");
    setIsEditModalVisible(false);
    setEditingContent(null);
    if (selectedProductID) {
      fetchProductContents(selectedProductID);
    }
  };


  const handleErrorEdit = () => {
    message.error("Chỉnh sửa nội dung thất bại!");
  };

  const handleDeleteVariant = async (variantID: string) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await ProductHandleApi(
            `/api/product/deleteVariant?variantID=${variantID}`,
            {},
            "delete"
          );

          if (response.status === 200) {
            message.success("Xóa thành công!");
            setPriceData((prevData) => prevData.filter((item) => item.variantID !== variantID));
          } else {
            message.error("Xóa thất bại. Vui lòng thử lại!");
          }
        } catch (error) {
          message.error("Đã xảy ra lỗi khi xóa!");
        }
      },
    });
  };


  return (
    <div className="p-5 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Quản lý sản phẩm</h1>

      <div className="flex gap-4 mb-6">
        {[{ id: 1, name: "IPhone" }, { id: 2, name: "IPad" }, { id: 3, name: "MacBook" }, { id: 4, name: "Apple Watch" }, { id: 5, name: "Phụ kiện" }].map((category) => (
          <button
            key={category.id}
            onClick={() => setCategoryID(category.id)}
            className={`px-4 py-2 rounded ${categoryID === category.id ? "bg-blue-500 text-white" : "bg-white text-gray-700 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-500"} hover:bg-blue-500 hover:text-white active:bg-blue-600 transition-all`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          enterButton
          allowClear
          onSearch={(value) => setSearchTerm(value)}
          className="w-full sm:w-1/2"
        />
        <Select
          defaultValue="all"
          className="w-full sm:w-1/4"
          onChange={(value) => setFilterStatus(value)}
        >
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="inStock">Còn hàng</Option>
          <Option value="outOfStock">Hết hàng</Option>
        </Select>
        <Button type="primary" onClick={showModal}>Tạo sản phẩm</Button>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4 cursor-pointer">
              {paginatedProducts.map((product) => (
                <div key={product.productID}
                  className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-50"
                  onClick={() => handleProductContentClick(product)}>
                  <img src={product.image} alt={product.productName} className="w-full h-40 object-contain rounded-md mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-black">{product.productName}</h3>
                  <p className="text-lg font-bold text-blue-500 mb-3">{product.price.toLocaleString("vi-VN")} đ</p>
                  <p className={`flex items-center gap-2 text-sm font-medium ${product.status === 1 ? "text-green-500" : "text-red-500"}`}>
                    {product.status === 1 ? "Còn hàng" : "Hết hàng"}
                  </p>
                  <Button
                    type="primary"
                    icon={<FileAddFilled />}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition-all mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddContent(product.productID);
                    }}
                  >
                    Thêm nội dung
                  </Button>
                  <div className="flex items-center justify-start gap-4 mt-4">
                    <Button
                      type="primary"
                      icon={<FileAddFilled />}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-all text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(product.productID);
                      }}
                    >
                      Thêm giá tiền
                    </Button>

                    <Button
                      type="default"
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-medium py-2 px-4 rounded-md transition-all text-center border border-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPriceModal(product.productID);
                      }}
                    >
                      Xem giá tiền
                    </Button>
                  </div>
                  <div className="flex items-center justify-start gap-3 mt-4">
                    <Button
                      type="primary"
                      className="px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSpecModal(product.productID);
                      }}
                    >
                      Thêm thông số
                    </Button>

                    <Button
                      type="default"
                      className="px-6 bg-gray-200 hover:bg-gray-300 text-black font-medium py-2 rounded-md transition-all border border-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen(product.productID);
                      }}
                    >
                      Xem thông số
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredProducts.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger
                onShowSizeChange={(current, size) => setPageSize(size)}
              />
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400">Không có sản phẩm nào khớp với tiêu chí.</div>
        )}
      </div>


      <AddPriceModal
        visible={isModalAddPriceVisible}
        onClose={handleCloseModal}
        productID={selectedAddPriceProductID || ""}
      />


      <AddSpecificationModal
        visible={isAddSpecModalVisible}
        onClose={handleCloseSpecModal}
        productID={selectedAddSpecProductID || ""}
      />

      <Modal
        title="Thông số kỹ thuật"
        visible={isVisible}
        onCancel={handleClose}
        footer={null}
        width={600}
      >
        <Table
          dataSource={specifications}
          columns={columns}
          rowKey="specificationID"
          pagination={false}
        />
      </Modal>

      <Modal
        title="Tạo sản phẩm mới"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} initialValues={{ categoryID: 1 }} onFinish={handleCreateProduct}>
          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryID"
            label="Danh mục sản phẩm"
            rules={[{ required: true, message: "Chọn danh mục sản phẩm!" }]}
          >
            <Select defaultValue={1} onChange={(value) => form.setFieldsValue({ categoryID: value })}>
              <Option value={1}>Điện thoại</Option>
              <Option value={2}>iPad</Option>
              <Option value={3}>MacBook</Option>
              <Option value={4}>Apple Watch</Option>
              <Option value={5}>Phụ kiện</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (Triệu VND)"
            rules={[{ required: true, message: "Nhập giá sản phẩm!" }]}
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
            {imagePreview && <img src={imagePreview} alt="preview" style={{ width: '30%', marginTop: 10 }} />}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Tạo sản phẩm</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thêm nội dung sản phẩm"
        visible={isContentModalVisible}
        onCancel={() => setIsContentModalVisible(false)}
        footer={null}
      >
        <Form form={contentForm} onFinish={handleSubmitContent}>
          <Form.Item
            name="title"
            label="Tiêu đề"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contentText"
            label="Nội dung"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="displayOrder"
            label="Thứ tự hiển thị"
            rules={[{ required: true, message: "Nhập thứ tự hiển thị!" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              beforeUpload={handleContentUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn và tải hình ảnh</Button>
            </Upload>
            {contentImagePreview && <img src={contentImagePreview} alt="preview" style={{ width: '30%', marginTop: 10 }} />}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Xác nhận</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={selectedProduct?.productName || "Nội dung sản phẩm"}
        visible={isProductContentModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {productContents.length > 0 ? (
          productContents
            .slice(0, isExpanded ? productContents.length : 3)
            .map((content, index) => (
              <div key={index} className="space-y-4 mb-6">
                {content.title && (
                  <h2 className="text-xl font-semibold">{content.title}</h2>
                )}
                {content.contentText && (
                  <p className="text-gray-700">{content.contentText}</p>
                )}
                {content.contentImage && (
                  <img
                    src={content.contentImage}
                    alt={content.title || "Product Content"}
                    className="w-full h-[200px] object-contain rounded-md"
                  />
                )}
                <Button
                  type="link"
                  onClick={() => {
                    setEditingContent(content);
                    setIsEditModalVisible(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </div>
            ))
        ) : (
          <p className="text-center text-gray-600">Không có nội dung nào.</p>
        )}
        {productContents.length > 3 && (
          <div className="text-center mt-4">
            <Button
              type="link"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500"
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        title="Chỉnh sửa nội dung"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingContent(null);
        }}
        footer={null}
      >
        <Form
          form={editForm}
          onFinish={(values) => handleEditProductContent(values)}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contentText"
            label="Nội dung"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="displayOrder"
            label="Thứ tự hiển thị"
            rules={[{ required: true, message: "Nhập thứ tự hiển thị!" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="image"
            label="Hình ảnh"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Xác nhận</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Danh sách giá tiền"
        visible={isPriceModalVisible}
        onCancel={handleClosePriceModal}
        footer={null}
        width={800}
      >
        <Table
          dataSource={priceData}
          columns={dataColumns}
          rowKey="variantID"
          pagination={false}
        />
      </Modal>


    </div>
  );
};

export default ProductManagement;
