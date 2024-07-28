import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { logout } from '@/services/user'
import toast from 'react-hot-toast'
import styles from './toolbar.module.scss'
import { useRouter } from 'next/router'

export default function Toolbar({ handleShow }) {
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // 定義登出函數
  const handleLogout = async () => {
    try {
      const res = await logout()
      if (res.data.status === 'success') {
        toast.success('已成功登出')
        setAuth({ isAuth: false, userData: {} })
        router.push('http://localhost:3000/test/user') // 導向登入頁面或其他頁面
      } else {
        toast.error('登出失敗')
      }
    } catch (error) {
      toast.error('登出過程中發生錯誤')
    }
  }

  return (
    <ul className="navbar-nav pe-2 ms-auto">
      <li className="nav-item">
        <Link
          className="nav-link btn btn-outline-light"
          href="/cart"
          role="button"
          title="購物車"
        >
          <i className="bi bi-cart-fill"></i>
          <p className="d-none d-md-inline d-lg-none"> 購物車</p>
        </Link>
      </li>
      <li className={`nav-item dropdown ${styles['dropdown']}`}>
        <Link
          className="nav-link dropdown-toggle btn btn-outline-light"
          href=""
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          title="會員中心"
        >
          <i className="bi bi-person-circle"></i>
          <p className="d-none d-md-inline d-lg-none">會員中心</p>
        </Link>
        <ul
          className={`dropdown-menu dropdown-menu-end p-4 mw-100 ${styles['slideIn']} ${styles['dropdown-menu']}`}
        >
          <li>
            <p className="text-center">
              <Image
                src="/avatar.svg"
                className="rounded-circle d-block mx-auto"
                alt="..."
                width={80}
                height={80}
              />
            </p>
            <p className="text-center">
              會員姓名: {auth.isAuth ? auth.userData.name : '未登錄'}
              <br />
              帳號: {auth.isAuth ? auth.userData.username : '未登錄'}
            </p>
          </li>
          <li>
            <Link
              className="dropdown-item text-center"
              href="/test/user/profile"
            >
              會員
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <Link className="dropdown-item text-center" href="/about">
              客服中心
            </Link>
          </li>
          {auth.isAuth && (
            <li>
              <hr className="dropdown-divider" />
            </li>
          )}
          {auth.isAuth && (
            <li>
              <span
                className="dropdown-item text-center"
                role="presentation"
                onClick={(e) => {
                  e.preventDefault()
                  handleLogout()
                }}
                title="登出"
              >
                登出
              </span>
            </li>
          )}
        </ul>
      </li>
      <li className="nav-item">
        <span
          className="nav-link btn btn-outline-light"
          role="presentation"
          onClick={(e) => {
            e.preventDefault()
            handleShow()
          }}
          title="展示"
        >
          <i className="bi bi-mortarboard-fill"></i>
          <p className="d-none d-md-inline d-lg-none"> 展示</p>
        </span>
      </li>
    </ul>
  )
}
