import React, { useState, useEffect } from 'react';

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/purchase-orders');
      const data = await response.json();
      if (data.status === 'success') {
        setOrders(data.data.orders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      setError('An error occurred while fetching orders');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-TW');
  };

  return (
    <div>
      <h1>我的訂單</h1>
      {error && <p>錯誤: {error}</p>}
      <table>
        <thead>
          <tr>
            <th>訂單編號</th>
            <th>金額</th>
            <th>交易ID</th>
            <th>付款方式</th>
            <th>配送方式</th>
            <th>狀態</th>
            <th>建立時間</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.amount}</td>
              <td>{order.transaction_id}</td>
              <td>{order.payment}</td>
              <td>{order.shipping}</td>
              <td>{order.status}</td>
              <td>{formatDate(order.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrders;