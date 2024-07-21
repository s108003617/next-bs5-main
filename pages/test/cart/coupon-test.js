import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/services/axios-instance'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart-state'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import CartList from '@/components/cart/list'
import { useShip711StoreOpener } from '@/hooks/use-ship-711-store'

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
  const [finalPrice, setFinalPrice] = useState(0)
  const [order, setOrder] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [checkedItems, setCheckedItems] = useState({})

  const { store711, openWindow, closeWindow } = useShip711StoreOpener(
    'http://localhost:3005/api/shipment/711',
    { autoCloseMins: 3 }
  )

  useEffect(() => {
    setCheckedItems({});
  }, [cart.items]);

  useEffect(() => {
    const checkedTotal = cart.items.reduce((total, item) => {
      if (checkedItems[item.id]) {
        return total + (item.quantity * item.price);
      }
      return total;
    }, 0);
    
    const calculatedOriginalPrice = Math.round(checkedTotal);
    setFinalPrice(calculatedOriginalPrice);
    
    if (selectedCouponId) {
      const coupon = couponOptions.find((v) => v.id === selectedCouponId);
      const discountedTotal = coupon.type === 'amount'
        ? Math.max(0, calculatedOriginalPrice - coupon.value)
        : Math.round(calculatedOriginalPrice * (1 - coupon.value));
      setFinalPrice(discountedTotal);
    }
  }, [cart.items, checkedItems, selectedCouponId, couponOptions]);

  const handleCheckItem = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const createOrder = async () => {
    try {
      const products = cart.items.filter(item => checkedItems[item.id]).map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: Math.round(item.price),
      }));

      const orderData = {
        amount: finalPrice,
        discountedAmount: finalPrice,
        products,
        shipment: {
          type: '711',
          storeId: store711.storeid,
          storeName: store711.storename,
          storeAddress: store711.storeaddress,
        },
      };

      const res = await axiosInstance.post('/line-pay/create-order', orderData);

      if (res.data.status === 'success') {
        setOrder(res.data.data.order);
        toast.success('已成功建立訂單');
      } else {
        toast.error('建立訂單失敗');
      }
    } catch (error) {
      toast.error('建立訂單時發生錯誤');
      console.error(error);
    }
  };

  const goLinePay = () => {
    if (window.confirm('確認要導向至LINE Pay進行付款?')) {
      window.location.href = `http://localhost:3005/api/line-pay/reserve?orderId=${order.orderId}`;
    }
  };

  const handleConfirm = async (transactionId) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/line-pay/confirm?transactionId=${transactionId}`
      );

      if (res.data.status === 'success') {
        toast.success('付款成功');
        clearCart();
      } else {
        toast.error('付款失敗');
      }

      if (res.data.data) {
        setResult(res.data.data);
      }

      setIsLoading(false);
    } catch (error) {
      toast.error('確認交易時發生錯誤');
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const { transactionId, orderId } = router.query;

      if (!transactionId || !orderId) {
        setIsLoading(false);
        return;
      }

      handleConfirm(transactionId);
    }
  }, [router.isReady]);

  const getSelectedTotal = () => {
    return Math.round(cart.items
      .filter(item => checkedItems[item.id])
      .reduce((total, item) => total + (item.quantity * item.price), 0));
  };

  return (
    <>
      <h1>購物車範例</h1>
      <p>
        <Link href="/test/cart/product-list">商品列表頁範例</Link>
      </p>

      <h4>購物車列表</h4>
      <CartList checkedItems={checkedItems} onItemCheck={handleCheckItem} />
      <h4>折價券</h4>
      <div className="mb-3">
        <select
          className="form-select"
          value={selectedCouponId}
          onChange={(e) => {
            setSelectedCouponId(Number(e.target.value))
          }}
        >
          <option value="0">選擇折價券</option>
          {couponOptions.map((v) => {
            return (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            )
          })}
        </select>
        <hr />
        <p>選擇商品總計: ${getSelectedTotal()}</p>
        <p>實際付款金額: {finalPrice}</p>
      </div>
      <h4>7-11 運送商店選擇</h4>
      <div className="mb-3">
        <button onClick={openWindow}>選擇門市</button>
        <br />
        門市名稱: <input type="text" value={store711.storename} disabled />
        <br />
        門市地址: <input type="text" value={store711.storeaddress} disabled />
      </div>
      <h4>測試按鈕</h4>
      <div className="btn-group-vertical">
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
            removeItem('222')
            toast.success('移除項目 id=222')
          }}
        >
          移除項目(id=222)
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            updateItemQty(222, 7)
            toast.success('更新項目 id=222 的數量為 7')
          }}
        >
          更新項目 id=222 的數量為 7
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            updateItemQty(111, 99)
            toast.success('更新項目 id=111 的數量為 99')
          }}
        >
          更新項目 id=111 的數量為 99
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
        <button className="btn btn-outline-secondary" onClick={createOrder}>
          產生訂單
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={goLinePay}
          disabled={!order.orderId}
        >
          前往付款
        </button>
      </div>
      <Toaster />
    </>
  )
}
