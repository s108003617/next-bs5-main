import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/services/axios-instance'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart-state'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import List from '@/components/cart/list'
import Image from 'next/image'

const coupons = [
  { id: 1, name: '折100元', value: 100, type: 'amount' },
  { id: 2, name: '折300元', value: 300, type: 'amount' },
  { id: 3, name: '折550元', value: 550, type: 'amount' },
  { id: 4, name: '8折券', value: 0.2, type: 'percent' },
]

export default function Coupon() {
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
        ? calculateSelectedTotal() - coupon.value
        : Math.round(calculateSelectedTotal() * (1 - coupon.value))

    setNetTotal(newNetTotal)
  }, [cart.items, selectedCouponId, selectedItems])

  const calculateSelectedTotal = () => {
    return cart.items.reduce((total, item) => {
      if (selectedItems[item.id]) {
        return total + item.quantity * item.price
      }
      return total
    }, 0)
  }

  const createOrder = async () => {
    // ... (保持原有的 createOrder 邏輯不變)
  }

  const goLinePay = () => {
    // ... (保持原有的 goLinePay 邏輯不變)
  }

  const handleConfirm = async (transactionId) => {
    // ... (保持原有的 handleConfirm 邏輯不變)
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
        <div className="col-md-8">
          <List 
            selectedItems={selectedItems} 
            setSelectedItems={setSelectedItems}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            calculateSelectedTotal={calculateSelectedTotal}
          />
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
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
              <p><strong>最後折價金額:</strong> ${netTotal}</p>
              <button className="btn btn-primary w-100" onClick={createOrder}>
                產生訂單
              </button>
              <button
                className="btn btn-success w-100 mt-2"
                onClick={goLinePay}
                disabled={!order.orderId}
              >
                前往付款
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h4>測試按鈕</h4>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              console.log(cart)
              toast.success('已在主控台記錄cart狀態')
            }}
          >
            主控台記錄cart狀態
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              addItem({
                id: '111',
                quantity: 5,
                name: 'iphone',
                price: 15000,
                color: 'red',
                size: '',
              })
              toast.success('新增項目 id=111')
            }}
          >
            新增項目(id=111, x5)
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              addItem({
                id: '222',
                quantity: 1,
                name: 'ipad',
                price: 19000,
                color: '',
                size: '',
              })
              toast.success('新增項目 id=222')
            }}
          >
            新增項目(id=222, x1)
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
      <Toaster />
    </div>
  )
}