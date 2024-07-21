import { useCart } from '@/hooks/use-cart-state'
import { useEffect, useState } from 'react'

export default function CartList({ 
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
                  <td>${v.price}</td>
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
                  <td>${v.subtotal}</td>
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
            <strong>總金額:</strong> ${calculateSelectedTotal()}
          </div>
        </div>
        {cart.isEmpty && <p className="text-muted mt-3">購物車為空</p>}
      </div>
    </div>
  )
}