import React, { useState } from 'react'
import { register } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/hooks/use-auth'
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaIdCard,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa'
import { useRouter } from 'next/router'

export default function Register() {
  const { auth } = useAuth()
  const router = useRouter()

  if (auth.isAuth) return null

  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  })

  const handleFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (user.password !== user.confirmPassword) {
      toast.error('密碼和確認密碼不匹配')
      return
    }
    const res = await register(user)

    if (res.data.status === 'success') {
      toast.success('會員註冊成功')
      setTimeout(() => {
        router.push('/test/user')
      }, 2000)
    } else {
      toast.error('會員註冊失敗')
    }
  }

  const fillSampleData = () => {
    setUser({
      name: '榮恩',
      email: 'ron@test.com',
      username: 'ron',
      password: '99999',
      confirmPassword: '99999',
    })
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">註冊</h2>
              <p className="text-muted text-center mb-4">
                註冊時，用戶名和電子郵件不能與現有帳戶重複
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="用戶名"
                      name="username"
                      value={user.username}
                      onChange={handleFieldChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="input-group position-relative">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type={showPasswords.password ? 'text' : 'password'}
                      className="form-control"
                      placeholder="密碼"
                      name="password"
                      value={user.password}
                      onChange={handleFieldChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() => togglePasswordVisibility('password')}
                      style={{ zIndex: 10 }}
                    >
                      {showPasswords.password ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="input-group position-relative">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type={showPasswords.confirmPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="確認密碼"
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleFieldChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() =>
                        togglePasswordVisibility('confirmPassword')
                      }
                      style={{ zIndex: 10 }}
                    >
                      {showPasswords.confirmPassword ? (
                        <FaEye />
                      ) : (
                        <FaEyeSlash />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaIdCard />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="姓名"
                      name="name"
                      value={user.name}
                      onChange={handleFieldChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="電子郵件"
                      name="email"
                      value={user.email}
                      onChange={handleFieldChange}
                      required
                    />
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg">
                    註冊
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={fillSampleData}
                  >
                    填入範例資料
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .btn-primary {
            background-color: #ff6433;
            border: none;
            color: white;
          }
          .mb-4 {
            font-family: 'Raleway', sans-serif;
          }
        `}
      </style>
      <Toaster />
    </div>
  )
}
