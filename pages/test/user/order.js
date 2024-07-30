import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Toaster, toast } from 'react-hot-toast'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        'http://localhost:3005/api/purchase-orders',
        {
          credentials: 'include',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      if (data.status === 'success') {
        setOrders(data.data.orders)
        toast.success('訂單資料載入成功')
      } else {
        throw new Error(data.message || 'Failed to fetch orders')
      }
    } catch (error) {
      setError(error.message)
      toast.error('訂單資料載入失敗')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-TW')
  }

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }


  return (
    <div className="container-fluid d-flex flex-column vh-100">
      <div className="row flex-grow-1">
      <nav
          id="sidebar"
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar"
        >
          <div className="position-sticky pt-3">
            <h3 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mb-1 text-muted text-uppercase">
              <span>會員中心</span>
            </h3>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link href="/test/user/profile" className="nav-link">
                  會員資料
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/test/user/profile-password" className="nav-link">
                  密碼更換
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/test/user/order" className="nav-link">
                  我的訂單
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/test/user/favorite" className="nav-link active">
                  我的收藏
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">我的訂單</h1>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">載入中...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              錯誤: {error}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-muted">目前沒有訂單</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>詳情</th>
                    <th>序號</th>
                    <th>金額</th>
                    <th>付款方式</th>
                    <th>配送方式</th>
                    <th>狀態</th>
                    <th>建立時間</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <React.Fragment key={order.id}>
                      <tr>
                        <td>
                          <button 
                            className="btn btn-link p-0" 
                            onClick={() => toggleOrderDetails(order.id)}
                          >
                            {expandedOrder === order.id ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </td>
                        <td>{index + 1}</td>
                        <td>{order.amount}</td>
                        <td>{order.payment || '未選擇'}</td>
                        <td>{order.shipping || '7-11'}</td>
                        <td>{order.status}</td>
                        <td>{formatDate(order.created_at)}</td>
                      </tr>
                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan="7">
                            <div className="p-3 bg-light">
                              <h5>訂單詳情</h5>
                             
                              <p><strong>原始金額:</strong> {order.original_amount}</p>
                              <p><strong>折扣金額:</strong> {order.original_amount - order.amount}</p>
                              <p><strong>使用優惠券:</strong> {order.coupon_id ? '是' : '否'}</p>
                              
                              <h6>購買商品:</h6>
                              <ul>
                                {JSON.parse(order.product_details).map((product, idx) => (
                                  <li key={idx}>
                                    {product.name} - 數量: {product.quantity}, 單價: {product.price}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <Toaster />
    </div>
  )
}

export default PurchaseOrders