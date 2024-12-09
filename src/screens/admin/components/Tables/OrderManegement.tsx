import ProductHandleApi from 'apis/ProductHandleApi';
import React, { useState, useEffect } from 'react';

interface Order {
  orderID: string;
  customerID: string;
  phone: string;
  fullName: string | null;
  orderDate: string;
  totalAmount: number;
  status: string | null;
  orderType: 'normal' | 'installment';
  variantID: string;
  productName: string;
  content: string | null;
  priceAtOrder: number;
  planName: string | null;
  durationMonths: number;
  monthlyPayment: number;
}


const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await ProductHandleApi('/api/product/getListOrder', {}, 'get');
      setOrders(response.data);
      setFilteredOrders(response.data);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (orderType !== 'all') {
      filtered = filtered.filter(order => order.orderType === orderType);
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, orderType]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOrderTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderType(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-md w-full md:w-auto"
        />
        <select
          value={orderType}
          onChange={handleOrderTypeChange}
          className="px-4 py-2 border rounded-md w-full md:w-auto"
        >
          <option value="all">Tất cả đơn hàng</option>
          <option value="normal">Đơn hàng thường</option>
          <option value="installment">Đơn hàng trả góp</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="p-2 border">Tên khách hàng</th>
              <th className="p-2 border">Số điện thoại</th>
              <th className="p-2 border">Ngày đặt</th>
              <th className="p-2 border">Sản phẩm</th>
              <th className="p-2 border">Số tiền</th>
              <th className="p-2 border">Loại đơn hàng</th>
              <th className="p-2 border">Nội dung</th>
              <th className="p-2 border">Thời hạn</th>
              <th className="p-2 border">Số tiền mỗi tháng</th>
              <th className="p-2 border">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderID}>
                <td className="p-2 border">{order.fullName || "Chưa có thông tin"}</td>
                <td className="p-2 border">{order.phone}</td>
                <td className="p-2 border">{order.orderDate}</td>
                <td className="p-2 border">{order.productName}</td>
                <td className="p-2 border">
                  {order.priceAtOrder.toLocaleString()} VND
                </td>
                <td className="p-2 border">
                  {order.orderType === "installment" ? "Trả góp" : "Thường"}
                </td>
                <td className="p-2 border">{order.content || "-"}</td>
                <td className="p-2 border">
                  {order.orderType === "installment" ? order.durationMonths : "-"}
                </td>
                <td className="p-2 border">
                  {order.orderType === "installment" ? order.monthlyPayment.toLocaleString() : "-"}
                </td>
                <td className="p-2 border">{order.status || "Chưa xử lý"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default OrderManagement;
