import { useCart } from '@/hooks/use-cart-state'
import { useEffect, useState } from 'react'

export default function CartList() {
  const { cart, items, decrement, increment, removeItem } = useCart()
  const [selectedItems, setSelectedItems] = useState({})
  const [allSelected, setAllSelected] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    const newSelectedItems = {}
    items.forEach(item => {
      newSelectedItems[item.id] = selectedItems[item.id] || false
    })
    setSelectedItems(newSelectedItems)
    setAllSelected(items.length > 0 && items.every(item => newSelectedItems[item.id]))
  }, [items])

  if (!hydrated) {
    return null
  }

  const handleCheckboxChange = (id) => {
    const newSelectedItems = { ...selectedItems, [id]: !selectedItems[id] }
    setSelectedItems(newSelectedItems)
    setAllSelected(items.every(item => newSelectedItems[item.id]))
  }

  const handleSelectAll = () => {
    const newAllSelected = !allSelected
    const newSelectedItems = {}
    items.forEach(item => {
      newSelectedItems[item.id] = newAllSelected
    })
    setSelectedItems(newSelectedItems)
    setAllSelected(newAllSelected)
  }

  const getSelectedTotal = () => {
    return Math.round(items
      .filter(item => selectedItems[item.id])
      .reduce((total, item) => total + item.subtotal, 0))
  }

  return (
    <div className="cart-list card shadow-sm">
      <style jsx>{`
        .cart-list {
          background-color: #fff;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .cart-list table {
          margin-bottom: 0;
        }
        .cart-list th {
          background-color: #f8f9fa;
          font-weight: 600;
          text-transform: uppercase;
          color: #495057;
          font-size: 0.875rem;
        }
        .cart-list td, .cart-list th {
          vertical-align: middle;
        }
        .cart-summary {
          background-color: #f8f9fa;
          padding: 1rem;
          font-size: 0.875rem;
        }
        .quantity-control {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quantity-control button {
          padding: 0.25rem 0.5rem;
        }
        .quantity-control span {
          margin: 0 0.5rem;
          min-width: 1.5rem;
          text-align: center;
        }
      `}</style>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  id="selectAll"
                />
                <label className="form-check-label" htmlFor="selectAll">全選</label>
              </div>
            </th>
            <th>商品</th>
            <th>單價</th>
            <th>數量</th>
            <th>小計</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedItems[item.id] || false}
                    onChange={() => handleCheckboxChange(item.id)}
                    id={`item-${item.id}`}
                  />
                  <label className="form-check-label" htmlFor={`item-${item.id}`}></label>
                </div>
              </td>
              <td>
                <div>{item.name}</div>
                <small className="text-muted">ID: {item.id}</small>
              </td>
              <td>${Math.round(item.price)}</td>
              <td>
                <div className="quantity-control">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => decrement(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => increment(item.id)}>+</button>
                </div>
              </td>
              <td>${Math.round(item.subtotal)}</td>
              <td>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.id)}>
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-summary">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span>已選擇 {Object.values(selectedItems).filter(Boolean).length} 件商品</span>
            <span className="ms-3">選擇商品總計: ${getSelectedTotal()}</span>
          </div>
          <div>
            <span>總計: ${Math.round(cart.totalPrice)}</span>
            <span className="ms-3">{cart.totalItems} 件商品</span>
          </div>
        </div>
        {cart.isEmpty && (
          <p className="mt-2 text-muted">購物車為空</p>
        )}
      </div>
    </div>
  )
}