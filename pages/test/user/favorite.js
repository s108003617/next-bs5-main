import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import { FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3005/api/favorites1', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      if (data.status === 'success') {
        setFavorites(data.data.favorites);
        toast.success('收藏資料載入成功');
      } else {
        throw new Error(data.message || 'Failed to fetch favorites');
      }
    } catch (error) {
      setError(error.message);
      toast.error('收藏資料載入失敗');
    } finally {
      setLoading(false);
    }
  };

  const cancelFavorite = async (favoriteId) => {
    try {
      const response = await fetch(`http://localhost:3005/api/favorites1?favoriteId=${favoriteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to cancel favorite');
      }
      const data = await response.json();
      if (data.status === 'success') {
        setFavorites(favorites.filter(fav => fav.id !== favoriteId));
        toast.success('收藏已成功刪除');
      } else {
        throw new Error(data.message || 'Failed to cancel favorite');
      }
    } catch (error) {
      setError(error.message);
      toast.error('刪除收藏失敗');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-TW');
  };

  const handleProductClick = (pid) => {
    router.push(`/product/${pid}`);
  };

  return (
    <div className="container-fluid d-flex flex-column vh-100">
      <div className="row flex-grow-1">
        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div className="position-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link href="/test/user/profile" className="nav-link">
                  會員中心
                </Link>
              </li>
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
            <p className="text-muted">目前沒有收藏項目</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>產品圖片</th>
                    <th>產品名稱</th>
                    <th>價格</th>
                    <th>收藏時間</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {favorites.map((favorite) => (
                    <tr key={favorite.id}>
                      <td>
                        {favorite.product && favorite.product.photos ? (
                          <Image
                            src={`/images/product/thumb/${favorite.product.photos.split(',')[0]}`}
                            alt={favorite.product.name}
                            width={50}
                            height={50}
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <span>無圖片</span>
                        )}
                      </td>
                      <td>
                        <span 
                          className="text-primary" 
                          style={{cursor: 'pointer', textDecoration: 'underline'}}
                          onClick={() => handleProductClick(favorite.pid)}
                        >
                          {favorite.product ? favorite.product.name : '產品不存在'}
                        </span>
                      </td>
                      <td>{favorite.product ? `$${favorite.product.price}` : 'N/A'}</td>
                      <td>{formatDate(favorite.created_at)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-link text-danger"
                          onClick={() => cancelFavorite(favorite.id)}
                          title="取消收藏"
                        >
                          <FaTrashAlt />
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
  );
};

export default Favorites;