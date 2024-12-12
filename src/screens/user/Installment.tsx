import { useEffect, useState } from "react";
import { Image, Input, message, Modal, Button } from "antd"; // Import Modal, Button
import { v4 as uuidv4 } from "uuid"; // Import UUID
import { useProduct } from "./ProductContext";
import ProductHandleApi from "apis/ProductHandleApi";

interface InstallmentPlan {
  installmentPlanID: number;
  productID: string;
  planName: string | null;
  price: number;
  durationMonths: number;
  interestRate: number;
  downPayment: number;
  monthlyPayment: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

function Installment() {
  const { product } = useProduct();
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    content: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterInstallment = async () => {
    if (!selectedPlan || !product) {
      message.error("Vui lòng chọn kế hoạch trả góp.");
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.content.trim()) {
      message.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const customerID = uuidv4();
    const orderID = uuidv4();
    const orderDetailID = uuidv4();

    const orderData = {
      fullName: formData.name,
      phone: formData.phone,
      content: formData.content,
      priceAtOrder: product.price,
      variantID: product.variantID || null,
      productID: product.productID,
      totalAmount: selectedPlan.totalAmount,
      customerID,
      orderID,
      orderDetailID,
      installmentPlanID: selectedPlan.installmentPlanID,
      orderType: "installment",
    };

    try {
      setIsLoading(true);
      const response = await ProductHandleApi(`/api/product/createOrder`, orderData, "post");

      if (response.status === 200) {
        message.success("Đơn hàng trả góp đã được tạo thành công!");
        setIsModalVisible(false);
      } else {
        message.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      message.error("Không thể kết nối tới hệ thống. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!product.productID) {
      console.error("ProductID is missing in the location state");
      return;
    }

    const fetchInstallmentPlans = async () => {
      try {
        const response = await ProductHandleApi(
          `/api/product/getInstallmentPlanOfProduct?productID=${product.productID}&variantID=${product.variantID}`,
          {},
          "get"
        );
        const plans = response.data.map((plan: any) => {
          const price = product.price;
          const interestRate = 2.3;
          const downPayment = price * 0.1;
          const remainingAmount = price - downPayment;
          const monthlyInterestRate = interestRate / 100 / 12;
          const durationMonths = plan.durationMonths;
          const monthlyPayment =
            (remainingAmount * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -durationMonths));
          const totalAmount = downPayment + monthlyPayment * durationMonths;

          return {
            ...plan,
            downPayment,
            monthlyPayment: Math.ceil(monthlyPayment),
            totalAmount: Math.ceil(totalAmount),
          };
        });
        setInstallmentPlans(plans);
        setSelectedPlan(plans[0]);
      } catch (error) {
        console.error("Error fetching installment plans:", error);
      }
    };

    fetchInstallmentPlans();
  }, [product.productID]);

  return (
    <div className="p-4 bg-gray-50">
      <div className="w-[360px] sm:w-[620px] h-auto mx-auto bg-white rounded-lg shadow-md">
        <div className="flex items-center p-4">
          <Image
            src={product.image}
            alt={product.productName}
            width={100}
            height={100}
            className="rounded sm:w-[100px] sm:h-[100px]"
          />
          <div className="ml-4">
            <h2 className="text-base sm:text-lg font-semibold">
              Mua trả góp {product.productName}
            </h2>
            <p className="text-sm sm:text-red-600 sm:text-lg font-bold">
              Giá: {product.price.toLocaleString()} đ
            </p>
          </div>
        </div>
      </div>

      <div className="w-[360px] sm:w-[620px] h-auto mx-auto bg-white rounded-lg shadow-md p-4 mt-4">
        <h3 className="font-semibold mb-4 text-sm sm:text-base">Chọn số tháng trả góp:</h3>
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          {installmentPlans.map((plan) => (
            <div
              key={plan.durationMonths}
              className={`flex flex-col items-center p-2 border cursor-pointer rounded-lg w-[30%] sm:w-auto ${selectedPlan?.durationMonths === plan.durationMonths ? "bg-red-100 text-red-600" : "bg-gray-100"
                }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <span className="font-bold">{plan.durationMonths} Tháng</span>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm sm:text-base">
              <tbody>
                <tr>
                  <td className="p-3 border font-semibold">Giá sản phẩm</td>
                  <td className="p-3 border">{product.price.toLocaleString()} đ</td>
                </tr>
                <tr>
                  <td className="p-3 border font-semibold">Trả trước</td>
                  <td className="p-3 border">{selectedPlan.downPayment.toLocaleString()} đ</td>
                </tr>
                <tr>
                  <td className="p-3 border font-semibold">Góp mỗi tháng</td>
                  <td className="p-3 border">{selectedPlan.monthlyPayment.toLocaleString()} đ</td>
                </tr>
                <tr>
                  <td className="p-3 border font-semibold">Lãi suất</td>
                  <td className="p-3 border">2.3%</td>
                </tr>
                <tr>
                  <td className="p-3 border font-semibold">Tổng tiền phải trả</td>
                  <td className="p-3 border">{selectedPlan.totalAmount.toLocaleString()} đ</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <Button
          className="w-full mt-4 p-2 bg-red-600 text-white rounded-lg"
          onClick={() => setIsModalVisible(true)}
        >
          ĐĂNG KÝ TRẢ GÓP
        </Button>

        <p className="mt-4 text-xs sm:text-sm text-red-600">
          *** Bảng tính tham khảo, số tiền trả trước và hạn mức tùy thuộc vào hồ sơ được duyệt
        </p>
      </div>

      <Modal
        title="Thông tin đăng ký trả góp"
        visible={isModalVisible}
        onOk={handleRegisterInstallment}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={isLoading}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Input
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleInputChange}
          className="mb-2"
        />
        <Input
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleInputChange}
          className="mb-2"
        />
        <Input
          name="content"
          placeholder="Nội dung"
          value={formData.content}
          onChange={handleInputChange}
        />
      </Modal>
    </div>
  );
}

export default Installment;
