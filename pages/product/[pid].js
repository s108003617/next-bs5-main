import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Modal, Button } from 'react-bootstrap'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart-state'
import ProductCard from '@/components/fav-test/product-card'
import { Toaster } from 'react-hot-toast'
import Loader2 from '@/components/loader2'

export default function Detail() {
  const router = useRouter()
  const [product, setProduct] = useState({
    id: 0,
    name: '',
    price: 0,
    info: '',
    photos: '',
    category: '',
  })
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [productName, setProductName] = useState('')
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [displayImages, setDisplayImages] = useState([])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const showModal = (name) => {
    setProductName('產品：' + name + '已成功加入購物車')
    handleShow()
  }

  const getProduct = async (pid) => {
    const url = 'http://localhost:3005/api/products/' + pid

    try {
      const res = await fetch(url)
      const resData = await res.json()

      if (resData.status === 'success') {
        setProduct(resData.data.product)
        const productImages = resData.data.product.photos.split(',')
        setDisplayImages(productImages)
        getRelatedProducts(resData.data.product.category, productImages)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getRelatedProducts = async (category, productImages) => {
    const url = 'http://localhost:3005/api/products?category=' + category

    try {
      const res = await fetch(url)
      const resData = await res.json()

      if (resData.status === 'success') {
        const filteredProducts = resData.data.products.filter(p => p.id !== product.id)
        const shuffled = filteredProducts.sort(() => 0.5 - Math.random())
        setRelatedProducts(shuffled.slice(0, 4))

        // 從相關產品中選擇額外的圖片，直到總共有4張
        const additionalImages = shuffled.flatMap(p => p.photos.split(','))
        const allImages = [...productImages, ...additionalImages]
        setDisplayImages(allImages.slice(0, 4))

        setIsLoading(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getProduct(router.query.pid)
    }
  }, [router.isReady, router.query.pid])

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value))
  }

  const handleAddToCart = () => {
    const item = { ...product, quantity: quantity }
    addItem(item)
    showModal(product.name)
  }

  const handleDirectCheckout = () => {
    const item = { ...product, quantity: quantity }
    addItem(item)
    router.push('/test/cart/coupon-test')
  }

  const handleImageClick = (index) => {
    setCurrentImageIndex(index)
  }

  const messageModal = (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>加入購物車訊息</Modal.Title>
      </Modal.Header>
      <Modal.Body>{productName}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          繼續購物
        </Button>
        <Button variant="primary" onClick={() => router.push('/test/cart/coupon-test')}>
          前往購物車結帳
        </Button>
      </Modal.Footer>
    </Modal>
  )

  return (
    <div className="container mt-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/">首頁</Link></li>
          <li className="breadcrumb-item"><Link href="/test/cart/product-list">商品列表</Link></li>
          <li className="breadcrumb-item active" aria-current="page">商品詳細</li>
        </ol>
      </nav>

      <h1 className="mb-4">商品詳細頁</h1>

      {isLoading ? (
        <div className="text-center">
          <Loader2 />
        </div>
      ) : (
        <>
          <div className="row mb-5">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <Image
                    src={`/images/product/thumb/${displayImages[currentImageIndex]}`}
                    alt={product.name}
                    width={600}
                    height={400}
                    placeholder="blur"
                    blurDataURL={`/images/product/thumb/${displayImages[currentImageIndex]}`}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                </div>
                <div className="card-footer bg-white">
                  <div className="d-flex justify-content-between">
                    {displayImages.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => handleImageClick(index)}
                        className={`thumbnail-container ${currentImageIndex === index ? 'active' : ''}`}
                      >
                        <Image
                          src={`/images/product/thumb/${img}`}
                          alt={`Thumbnail ${index + 1}`}
                          width={116}
                          height={76}
                          className="img-thumbnail"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">{product.name}</h2>
                  <p className="text-danger fs-4">NTD {product.price}元</p>
                  <p className="card-text">{product.info}</p>
                  <p className="card-text"><small className="text-muted">類別: {product.category}</small></p>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">數量：</label>
                    <input
                      type="number"
                      id="quantity"
                      className="form-control"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      style={{ width: '80px' }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-success btn-lg me-2"
                    onClick={handleAddToCart}
                  >
                    加入購物車
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleDirectCheckout}
                  >
                    直接結帳
                  </button>
                  <div className="mt-3">
                    <ProductCard id={product.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="mb-4">相關推薦</h3>
          <div className="row row-cols-1 row-cols-md-4 g-4">
            {relatedProducts.map((v) => (
              <div className="col" key={v.id}>
                <div className="card h-100 shadow-sm hover-card">
                  <Link href={`/product/${v.id}`}>
                    <Image
                      className="card-img-top"
                      src={`/images/product/thumb/${v.photos?.split(',')[0]}`}
                      alt={v.name}
                      width={300}
                      height={200}
                      placeholder="blur"
                      blurDataURL={`/images/product/thumb/${v.photos?.split(',')[0]}`}
                      style={{ width: '100%', height: '200px', objectFit: 'contain' }}
                    />
                  </Link>
                  <div className="card-body">
                    <Link href={`/product/${v.id}`} className="text-decoration-none">
                      <h5 className="card-title">{v.name}</h5>
                    </Link>
                    <p className="card-text">{v.info}</p>
                    <p className="card-text text-danger">NTD {v.price}元</p>
                  </div>
                  <div className="card-footer bg-transparent">
                    <button
                      type="button"
                      className="btn btn-outline-success w-100"
                      onClick={() => {
                        const item = { ...v, quantity: 1 }
                        addItem(item)
                        showModal(v.name)
                      }}
                    >
                      加入購物車
                    </button>
                    <div className="mt-2">
                      <ProductCard key={v.id} id={v.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {messageModal}
      <Toaster />

      <style jsx global>{`
        .thumbnail-container {
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .thumbnail-container:hover,
        .thumbnail-container.active {
          opacity: 1;
          transform: scale(1.05);
        }
        .thumbnail-container.active img {
          border: 2px solid #007bff;
        }
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  )
}