import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/services/axios-instance'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart-state'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

const coupons = [
  { id: 1, name: '折100元', value: 100, type: 'amount' },
  { id: 2, name: '折300元', value: 300, type: 'amount' },
  { id: 3, name: '折550元', value: 550, type: 'amount' },
  { id: 4, name: '8折券', value: 0.2, type: 'percent' },
]

function CartList({ 
  selectedItems, 
  setSelectedItems, 
  selectAll, 
  setSelectAll, 
  calculateSelectedTotal 
}) {
  const { cart, items, decrement, increment, removeItem } = useCart()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return null
  }

  const handleItemSelect = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    const newSelectedItems = {}
    items.forEach(item => {
      newSelectedItems[item.id] = newSelectAll
    })
    setSelectedItems(newSelectedItems)
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">購物車列表</h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              id="selectAllCheckbox"
            />
            <label className="form-check-label" htmlFor="selectAllCheckbox">
              全選
            </label>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>選擇</th>
                <th>商品名稱</th>
                <th>單價</th>
                <th>數量</th>
                <th>小計</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedItems[v.id] || false}
                        onChange={() => handleItemSelect(v.id)}
                        id={`checkbox-${v.id}`}
                      />
                    </div>
                  </td>
                  <td>{v.name}</td>
                  <td>${Math.round(v.price)}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => decrement(v.id)}
                      >
                        -
                      </button>
                      <button type="button" className="btn btn-outline-secondary btn-sm" disabled>
                        {v.quantity}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => increment(v.id)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${Math.round(v.subtotal)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItem(v.id)}
                    >
                      移除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <strong>商品總數:</strong> {cart.totalItems}
          </div>
          <div>
            <strong>選中商品總金額:</strong> ${calculateSelectedTotal()}
          </div>
        </div>
        {cart.isEmpty && <p className="text-muted mt-3">購物車為空</p>}
      </div>
    </div>
  )
}

export default function CouponTest() {
  const router = useRouter()
  const { auth } = useAuth()
  const { cart, addItem, removeItem, updateItemQty, clearCart, isInCart } = useCart()

  const [couponOptions, setCouponOptions] = useState(coupons)
  const [selectedCouponId, setSelectedCouponId] = useState(0)
  const [netTotal, setNetTotal] = useState(0)
  const [order, setOrder] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState({})
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    const initialSelectedItems = cart.items.reduce((acc, item) => {
      acc[item.id] = false
      return acc
    }, {})
    setSelectedItems(initialSelectedItems)
  }, [cart.items])

  useEffect(() => {
    if (!selectedCouponId) {
      setNetTotal(calculateSelectedTotal())
      return
    }

    const coupon = couponOptions.find((v) => v.id === selectedCouponId)
    const newNetTotal =
      coupon.type === 'amount'
        ? Math.max(0, calculateSelectedTotal() - coupon.value)
        : Math.round(calculateSelectedTotal() * (1 - coupon.value))

    setNetTotal(newNetTotal)
  }, [cart.items, selectedCouponId, selectedItems])

  const calculateSelectedTotal = () => {
    return cart.items.reduce((total, item) => {
      if (selectedItems[item.id]) {
        return total + item.quantity * Math.round(item.price)
      }
      return total
    }, 0)
  }

 

const createOrder = async () => {
  setIsLoading(true)
  try {
    const selectedProducts = cart.items
      .filter(item => selectedItems[item.id])
      .map(item => ({
        ...item,
        price: Math.round(item.price)
      }))
    const orderData = {
      amount: netTotal,  // 使用折扣後的金額作為結帳金額
      originalAmount: calculateSelectedTotal(),
      products: selectedProducts,
      couponId: selectedCouponId  // 添加所使用的優惠券 ID
    }

    const res = await axiosInstance.post('/line-pay/create-order', orderData)

    if (res.data.status === 'success') {
      setOrder(res.data.data.order)
      toast.success('已成功建立訂單')
    } else {
      toast.error('建立訂單失敗')
    }
  } catch (error) {
    toast.error('建立訂單時發生錯誤')
    console.error(error)
  } finally {
    setIsLoading(false)
  }
}

// ... 其他代碼保持不變

  const goLinePay = () => {
    if (window.confirm('確認要導向至LINE Pay進行付款?')) {
      window.location.href = `http://localhost:3005/api/line-pay/reserve?orderId=${order.orderId}`
    }
  }

  const handleConfirm = async (transactionId) => {
    setIsLoading(true)
    try {
      const res = await axiosInstance.get(
        `/line-pay/confirm?transactionId=${transactionId}`
      )

      if (res.data.status === 'success') {
        toast.success('付款成功')
        clearCart()
      } else {
        toast.error('付款失敗')
      }
    } catch (error) {
      toast.error('確認交易時發生錯誤')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      const { transactionId, orderId } = router.query

      if (!transactionId || !orderId) {
        setIsLoading(false)
        return
      }

      handleConfirm(transactionId)
    }
  }, [router.isReady])

  return (
    <div className="container mt-5">
      <h1 className="mb-4">購物車範例</h1>
      <div className="row">
        <div className="col-lg-8 mb-4">
          <CartList 
            selectedItems={selectedItems} 
            setSelectedItems={setSelectedItems}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            calculateSelectedTotal={calculateSelectedTotal}
          />
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">折價券</h5>
              <select
                className="form-select mb-3"
                value={selectedCouponId}
                onChange={(e) => {
                  setSelectedCouponId(Number(e.target.value))
                }}
              >
                <option value="0">選擇折價券</option>
                {couponOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <p><strong>選中商品總價:</strong> ${calculateSelectedTotal()}</p>
              <p><strong>折扣後金額:</strong> ${netTotal}</p>
              <button 
                className="btn btn-primary w-100" 
                onClick={createOrder}
                disabled={isLoading || calculateSelectedTotal() === 0}
              >
                {isLoading ? '處理中...' : '產生訂單'}
              </button>
              <button
                className="btn btn-success w-100 mt-2"
                onClick={goLinePay}
                disabled={!order.orderId}
              >
                前往 LINE Pay 付款
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">測試按鈕</h5>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                console.log(cart)
                toast.success('已在主控台記錄cart狀態')
              }}
            >
              記錄購物車狀態
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                addItem({
                  id: '111',
                  quantity: 5,
                  name: 'iPhone',
                  price: 15000,
                  color: 'red',
                  size: '',
                })
                toast.success('新增項目 id=111')
              }}
            >
              新增 iPhone (x5)
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                addItem({
                  id: '222',
                  quantity: 1,
                  name: 'iPad',
                  price: 19000,
                  color: '',
                  size: '',
                })
                toast.success('新增項目 id=222')
              }}
            >
              新增 iPad (x1)
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                clearCart()
                toast.success('已清空購物車')
              }}
            >
              清空購物車
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}