import { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart-state'
import Image from 'next/image'
import ProductCard from '@/components/fav-test/product-card'
import { Toaster } from 'react-hot-toast'
import BS5Pagination from '@/components/common/bs5-pagination'
import { getProducts } from '@/services/product'

export default function ProductList() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [productName, setProductName] = useState('')
  const { addItem } = useCart()

  const [pageNow, setPageNow] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [allProducts, setAllProducts] = useState([])
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity })
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [sort, setSort] = useState('id')
  const [order, setOrder] = useState('asc')

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const showModal = (name) => {
    setProductName('產品：' + name + '已成功加入購物車')
    handleShow()
  }

  const handleGetProducts = async () => {
    const res = await getProducts({}, 1, 1000) // 獲取所有產品
    if (res.data.status === 'success') {
      setAllProducts(res.data.data.products)
      setTotal(res.data.data.total)
      setPageCount(Math.ceil(res.data.data.total / perPage))
      updateDisplayedProducts(
        res.data.data.products,
        searchTerm,
        priceRange,
        selectedCategory,
        sort,
        order
      )

      // 提取所有唯一的類別
      const uniqueCategories = [
        ...new Set(res.data.data.products.map((p) => p.category)),
      ]
      setCategories(uniqueCategories)
    }
  }

  const updateDisplayedProducts = (
    products,
    term,
    price,
    category,
    sortBy,
    orderBy
  ) => {
    let filtered = products

    if (term) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      )
    }

    filtered = filtered.filter(
      (product) => product.price >= price.min && product.price <= price.max
    )

    if (category) {
      filtered = filtered.filter((product) => product.category === category)
    }

    // 排序
    filtered.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return orderBy === 'asc' ? -1 : 1
      if (a[sortBy] > b[sortBy]) return orderBy === 'asc' ? 1 : -1
      return 0
    })

    setDisplayedProducts(filtered)
    setTotal(filtered.length)
    setPageCount(Math.ceil(filtered.length / perPage))
    setPageNow(1)
  }

  const handlePageClick = (event) => {
    setPageNow(event.selected + 1)
  }

  useEffect(() => {
    handleGetProducts()
  }, [])

  useEffect(() => {
    updateDisplayedProducts(
      allProducts,
      searchTerm,
      priceRange,
      selectedCategory,
      sort,
      order
    )
  }, [
    searchTerm,
    priceRange,
    selectedCategory,
    allProducts,
    perPage,
    sort,
    order,
  ])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    setPriceRange((prev) => ({
      ...prev,
      [name]: value ? Number(value) : name === 'min' ? 0 : Infinity,
    }))
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleSortChange = (e) => {
    const [newSort, newOrder] = e.target.value.split(',')
    setSort(newSort)
    setOrder(newOrder)
  }

  const messageModal = (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>加入購物車訊息</Modal.Title>
      </Modal.Header>
      <Modal.Body>{productName} </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          繼續購物
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            router.push('http://localhost:3000/test/cart/coupon-test')
          }
        >
          前往購物車結帳
        </Button>
      </Modal.Footer>
    </Modal>
  )

  const paginatedProducts = displayedProducts.slice(
    (pageNow - 1) * perPage,
    pageNow * perPage
  )

  const display = (
    <div className="row row-cols-1 row-cols-md-4 g-4">
      {paginatedProducts.map((v) => (
        <div className="col" key={v.id}>
          <div className="card">
            <Link href={`/product/${v.id}`}>
              <Image
                className="card-img-top"
                src={`/images/product/thumb/${v.photos?.split(',')[0]}`}
                alt={v.name}
                width={300}
                height={200}
                placeholder="blur"
                blurDataURL={`/images/product/thumb/${v.photos?.split(',')[0]}`}
                style={{ width: '100%', height: 'auto' }}
              />
            </Link>
            <div className="card-body">
              <Link href={`/product/${v.id}`}>
                <h5 className="card-title">{v.name}</h5>
              </Link>
              <p className="card-text">{v.info}</p>
              <p className="card-text text-danger">NTD {v.price}元</p>
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  const item = { ...v, quantity: 1 }
                  addItem(item)
                  showModal(v.name)
                }}
              >
                加入購物車
              </button>
              <ProductCard key={v.id} id={v.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <h1>商品列表頁</h1>
      <p>
        <Link href="/test/cart">購物車</Link>
      </p>
      <div className="my-3">
        <input
          type="text"
          className="form-control"
          placeholder="搜尋商品名稱"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="my-3 row">
        <div className="col">
          <input
            type="number"
            className="form-control"
            placeholder="最低價格"
            name="min"
            value={priceRange.min === 0 ? '' : priceRange.min}
            onChange={handlePriceChange}
          />
        </div>
        <div className="col">
          <input
            type="number"
            className="form-control"
            placeholder="最高價格"
            name="max"
            value={priceRange.max === Infinity ? '' : priceRange.max}
            onChange={handlePriceChange}
          />
        </div>
        <div className="col">
          <select
            className="form-control"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">所有類別</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          排序
          <select
            className="form-control"
            value={`${sort},${order}`}
            onChange={handleSortChange}
          >
            <option value="id,asc">ID排序(由小至大)</option>
            <option value="id,desc">ID排序(由大至小)</option>
            <option value="price,asc">價格排序(由低至高)</option>
            <option value="price,desc">價格排序(由高至低)</option>
          </select>
        </div>
      </div>
      <div className="my-3">
        <span>
          目前頁面: {pageNow} / 總頁數: {pageCount} / 總項目數: {total}
        </span>
      </div>
      {messageModal}
      {display}
      <div className="my-3">
        <BS5Pagination
          forcePage={pageNow - 1}
          onPageChange={handlePageClick}
          pageCount={pageCount}
        />
      </div>

      <Toaster />
    </>
  )
}
