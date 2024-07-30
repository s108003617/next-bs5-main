import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Toaster, toast } from 'react-hot-toast'
import { FaTrashAlt, FaHeart } from 'react-icons/fa'
import Image from 'next/image'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3005/api/favorites1', {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch favorites')
      }
      const data = await response.json()
      if (data.status === 'success') {
        setFavorites(data.data.favorites)
        
      } else {
        throw new Error(data.message || 'Failed to fetch favorites')
      }
    } catch (error) {
      setError(error.message)
      
    } finally {
      setLoading(false)
    }
  }

  const cancelFavorite = async (favoriteId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/favorites1?favoriteId=${favoriteId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to cancel favorite')
      }
      const data = await response.json()
      if (data.status === 'success') {
        setFavorites(favorites.filter((fav) => fav.id !== favoriteId))
        toast.success('收藏已成功刪除')
      } else {
        throw new Error(data.message || 'Failed to cancel favorite')
      }
    } catch (error) {
      setError(error.message)
      toast.error('刪除收藏失敗')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-TW')
  }

  const handleProductClick = (pid) => {
    router.push(`/product/${pid}`)
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
            <h1 className="h2">我的收藏</h1>
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
          ) : favorites.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <FaHeart size={64} className="text-muted" />
              </div>
              <h2 className="h4 mb-3">目前沒有收藏項目</h2>
              <p className="text-muted mb-4">您還沒有收藏任何商品。開始瀏覽並收藏您喜歡的商品吧！</p>
              <Link 
                href="http://localhost:3000/test/cart/product-list" 
                className="btn btn-primary btn-lg shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
              >
                <span className="me-2">瀏覽商品列表</span>
                <FaHeart />
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">產品圖片</th>
                    <th className="text-center">產品名稱</th>
                    <th className="text-center">價格</th>
                    <th className="text-center">收藏時間</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {favorites.map((favorite) => (
                    <tr key={favorite.id}>
                      <td className="text-center">
                        {favorite.product && favorite.product.photos ? (
                          <Image
                            src={`/images/product/thumb/${
                              favorite.product.photos.split(',')[0]
                            }`}
                            alt={favorite.product.name}
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover' }}
                            className="rounded"
                          />
                        ) : (
                          <span className="text-muted">無圖片</span>
                        )}
                      </td>
                      <td className="text-center">
                        <span
                          className="text-primary"
                          style={{
                            cursor: 'pointer',
                          }}
                          onClick={() => handleProductClick(favorite.pid)}
                        >
                          {favorite.product
                            ? favorite.product.name
                            : '產品不存在'}
                        </span>
                      </td>
                      <td className="text-center">
                        {favorite.product ? (
                          <span className="badge bg-success fs-6">
                            ${favorite.product.price}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="text-center">
                        {formatDate(favorite.created_at)}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => cancelFavorite(favorite.id)}
                          title="取消收藏"
                        >
                          <FaTrashAlt /> 移除
                        </button>
                      </td>
                    </tr>
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

export default Favorites
