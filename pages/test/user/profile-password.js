import React, { useState } from 'react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { updatePassword } from '@/services/user'
import { useAuth } from '@/hooks/use-auth'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const initUserPassword = {
  origin: '',
  new: '',
  confirm: '',
}

export default function PasswordChange() {
  const { auth } = useAuth()
  const [userPassword, setUserPassword] = useState(initUserPassword)
  const [showPasswords, setShowPasswords] = useState({
    origin: false,
    new: false,
    confirm: false,
  })

  const handleFieldChange = (e) => {
    setUserPassword({ ...userPassword, [e.target.name]: e.target.value })
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userPassword.new || !userPassword.origin || !userPassword.confirm) {
      toast.error('密碼欄位為必填')
      return
    }

    if (userPassword.new !== userPassword.confirm) {
      toast.error('新密碼與確認密碼不同')
      return
    }

    const password = { origin: userPassword.origin, new: userPassword.new }
    const res = await updatePassword(auth.userData.id, password)

    if (res.data.status === 'success') {
      toast.success('會員密碼修改成功')
      setUserPassword(initUserPassword)
    } else {
      toast.error('會員密碼修改失敗')
    }
  }

  if (!auth.isAuth) return null

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

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 d-flex flex-column">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">密碼更換</h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex-grow-1">
            <div className="mb-3">
              <label htmlFor="origin" className="form-label">
                目前密碼
              </label>
              <div className="position-relative">
                <input
                  type={showPasswords.origin ? 'text' : 'password'}
                  className="form-control"
                  id="origin"
                  name="origin"
                  value={userPassword.origin}
                  onChange={handleFieldChange}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                  onClick={() => togglePasswordVisibility('origin')}
                  style={{ zIndex: 10 }}
                >
                  {showPasswords.origin ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="new" className="form-label">
                新密碼
              </label>
              <div className="position-relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  className="form-control"
                  id="new"
                  name="new"
                  value={userPassword.new}
                  onChange={handleFieldChange}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                  onClick={() => togglePasswordVisibility('new')}
                  style={{ zIndex: 10 }}
                >
                  {showPasswords.new ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="confirm" className="form-label">
                新密碼確認
              </label>
              <div className="position-relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  className="form-control"
                  id="confirm"
                  name="confirm"
                  value={userPassword.confirm}
                  onChange={handleFieldChange}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                  onClick={() => togglePasswordVisibility('confirm')}
                  style={{ zIndex: 10 }}
                >
                  {showPasswords.confirm ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              修改
            </button>
          </form>
        </main>
      </div>

      <style jsx>
        {`
          .btn-primary {
            background-color: #ff6433;
            border: none;
            color: white;
          }
        `}
      </style>
      <Toaster />
    </div>
  )
}
