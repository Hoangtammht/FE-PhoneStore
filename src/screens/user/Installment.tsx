import { Image } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "./ProductContext";

function Installment() {
  const { productId } = useParams();
  const { product } = useProduct();
  const [selectedCompany, setSelectedCompany] = useState("Shinhan Finance")
  const [selectedMonths, setSelectedMonths] = useState(6)

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
              Giá: {product.price} đ
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 w-[360px] sm:w-[620px] h-[260px] mx-auto bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-sm">
          Chọn phương thức thanh toán phù hợp:
        </h3>
        <div className="flex flex-wrap justify-between sm:justify-center items-center h-full gap-2">
          {[
            {
              name: "Công ty tài chính",
              color: "text-red-600",
              img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:80/plain/https://cellphones.com.vn/media/logo/dollar.png",
            },
            {
              name: "Thẻ tín dụng",
              color: "text-orange-600",
              img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:80/plain/https://cellphones.com.vn/media/logo/credit-card.png",
            },
            {
              name: "Trả góp qua Kredivo",
              color: "text-blue-600",
              img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:80/plain/https://cellphones.com.vn/media/logo/kredivo.png",
            },
            {
              name: "Trả góp qua Fundiin",
              color: "text-green-600",
              img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:80/plain/https://cellphones.com.vn/media/wysiwyg/fundiin-logo.png",
            },
            {
              name: "Trả góp qua Home",
              color: "text-pink-600",
              img: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:80/plain/https://cellphones.com.vn/media/wysiwyg/home-pay-later_3.png",
            },
          ].map((option, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between p-4 border rounded-lg w-[90px] h-[90px] sm:w-[111px] sm:h-[105px]"
            >
              <img
                src={option.img}
                alt={option.name}
                style={{ maxWidth: '60px', maxHeight: '30px', objectFit: 'contain' }}
                className="max-w-[30px] max-h-[30px] sm:max-w-[20px] sm:max-h-[20px] object-contain"
              />
              <span className={`font-semibold text-center text-[12px] leading-[16px] sm:text-[12px] sm:leading-[14px] w-[80px] ${option.color}`}>
                {option.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[360px] sm:w-[620px] h-auto mx-auto bg-white rounded-lg shadow-md p-4 mt-4">
        <h3 className="font-semibold mb-4 text-sm sm:text-base">Chọn công ty tài chính:</h3>
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          {[
            {
              name: "Shinhan Finance",
              logo: "https://cdn2.cellphones.com.vn/x50,webp,q100/media/logo/shinhan-finance-color.png",
            },
            {
              name: "Home Credit",
              logo: "https://cdn2.cellphones.com.vn/x34,webp,q100/media/logo/home-credit-color.png",
            },
            {
              name: "HD Saison",
              logo: "https://cdn2.cellphones.com.vn/x34,webp,q100/media/logo/hd-saison.png",
            },
            {
              name: "Samsung Finance+",
              logo: "https://cdn2.cellphones.com.vn/x34,webp,q100/media/logo/samsung-finance-color.png",
            },
          ].map((company) => (
            <button
              key={company.name}
              onClick={() => setSelectedCompany(company.name)}
              className={`p-2 border rounded-lg flex items-center justify-center w-[45%] sm:w-[120px] h-[60px] ${selectedCompany === company.name ? "border-red-500" : "border-gray-300"
                }`}
            >
              <Image
                src={company.logo}
                width={80}
                height={40}
                className="object-contain"
                alt={company.name}
              />
            </button>
          ))}
        </div>

        <h3 className="font-semibold mb-4 text-sm sm:text-base">Chọn số tháng trả góp:</h3>
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          {[3, 4, 6, 8, 9].map((months) => (
            <button
              key={months}
              onClick={() => setSelectedMonths(months)}
              className={`p-2 border rounded-lg w-[30%] sm:w-auto ${selectedMonths === months ? "bg-red-100 text-red-600" : "bg-gray-100"
                }`}
            >
              {months} Tháng
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <tbody>
              <tr>
                <td className="p-2 border">Công ty</td>
                <td className="p-2 border">
                  <Image
                    src={
                      [
                        {
                          name: "Shinhan Finance",
                          logo: "https://cdn2.cellphones.com.vn/x50,webp,q100/media/logo/shinhan-finance-color.png",
                        },
                        {
                          name: "Home Credit",
                          logo: "https://cdn2.cellphones.com.vn/x34,webp,q100/media/logo/home-credit-color.png",
                        },
                        {
                          name: "HD Saison",
                          logo: "https://cdn2.cellphones.com.vn/x34,webp,q100/media/logo/hd-saison.png",
                        },
                        {
                          name: "Samsung Finance+",
                          logo: "https://cdn2.cellphones.com.vn/x34,webp,q100/media/logo/samsung-finance-color.png",
                        },
                      ].find((company) => company.name === selectedCompany)?.logo || "/placeholder.svg"
                    }
                    alt={selectedCompany}
                    width={80}
                    height={30}
                    className="object-contain"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Giá sản phẩm</td>
                <td className="p-2 border">10.890.000 đ</td>
              </tr>
              <tr>
                <td className="p-2 border">Giá mua trả góp</td>
                <td className="p-2 border text-red-600">10.890.000 đ</td>
              </tr>
              <tr>
                <td className="p-2 border">Trả trước từ</td>
                <td className="p-2 border">
                  <select className="border p-1 w-full">
                    <option>30%</option>
                    <option>40%</option>
                    <option>50%</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Lãi suất</td>
                <td className="p-2 border text-yellow-600">0%</td>
              </tr>
              <tr>
                <td className="p-2 border">Giấy tờ cần có</td>
                <td className="p-2 border">CCCD có chip hoặc CMND + BLX</td>
              </tr>
              <tr>
                <td className="p-2 border">Góp mỗi tháng</td>
                <td className="p-2 border">1.271.000 đ</td>
              </tr>
              <tr>
                <td className="p-2 border">Gốc + lãi</td>
                <td className="p-2 border">1.271.000 đ</td>
              </tr>
              <tr>
                <td className="p-2 border">Phí thu hộ</td>
                <td className="p-2 border">0 đ</td>
              </tr>
              <tr>
                <td className="p-2 border">
                  <label>
                    <input type="checkbox" className="mr-2" />
                    Bảo hiểm
                  </label>
                </td>
                <td className="p-2 border">0 đ</td>
              </tr>
              <tr>
                <td className="p-2 border font-bold">Tổng tiền phải trả</td>
                <td className="p-2 border text-red-600 font-bold">10.893.000 đ</td>
              </tr>
              <tr>
                <td className="p-2 border">Chênh lệch với mua hàng trả thẳng</td>
                <td className="p-2 border">3.000 đ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="w-full mt-4 p-2 bg-red-600 text-white rounded-lg text-sm sm:text-base">
          ĐĂNG KÝ TRẢ GÓP
        </button>

        <p className="mt-4 text-xs sm:text-sm text-red-600">
          *** Bảng tính tham khảo, số tiền trả trước và hạn mức tùy thuộc vào hồ sơ được duyệt
        </p>
      </div>


    </div>
  );
}


export default Installment;