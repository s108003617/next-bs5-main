import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart-state'
import { logout, getUserById } from '@/services/user'
import toast from 'react-hot-toast'
import styles from './toolbar.module.scss'
import { useRouter } from 'next/router'
import { avatarBaseUrl } from '@/configs'

export default function Toolbar({ handleShow }) {
  const { auth, setAuth } = useAuth()
  const { clearCart } = useCart()
  const router = useRouter()
  const [userAvatar, setUserAvatar] = useState('')

  useEffect(() => {
    if (auth.isAuth) {
      getUserData(auth.userData.id)
    }
  }, [auth])

  const getUserData = async (id) => {
    try {
      const res = await getUserById(id)
      if (res.data.status === 'success') {
        const dbUser = res.data.data.user
        setUserAvatar(dbUser.avatar || '')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await logout()
      if (res.data.status === 'success') {
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Clear localStorage
        localStorage.removeItem('cart');

        // Clear cart state
        clearCart();

        toast.success('已成功登出')
        setAuth({ isAuth: false, userData: {} })
        router.push('/test/user')
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
          href="http://localhost:3000/test/cart/coupon-test"
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
          <p className="d-none d-md-inline d-lg-none">
            {auth.isAuth ? '會員中心' : '登入'}
          </p>
        </Link>
        <ul
          className={`dropdown-menu dropdown-menu-end p-4 mw-100 ${styles['slideIn']} ${styles['dropdown-menu']}`}
        >
          {auth.isAuth ? (
            <>
              <li>
                <p className="text-center mb-2">
                  <Image
                    src={userAvatar ? `${avatarBaseUrl}/${userAvatar}` : '/avatar.svg'}
                    className="rounded-circle d-block mx-auto"
                    alt="Avatar"
                    width={80}
                    height={80}
                  />
                </p>
                <p className="text-center">
                  會員姓名: {auth.userData.name}
                  <br />
                  帳號: {auth.userData.username}
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
            </>
          ) : (
            <li>
              <Link
                className="dropdown-item text-center"
                href="/test/user/profile"
              >
                登入
              </Link>
            </li>
          )}
        </ul>
      </li>
    </ul>
  )
}