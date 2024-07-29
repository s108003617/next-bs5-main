import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useInterval from '@/hooks/use-interval'
import { requestOtpToken, resetPassword } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [disableBtn, setDisableBtn] = useState(false)

  const [count, setCount] = useState(60)
  const [delay, setDelay] = useState(null)

  const router = useRouter()

  useInterval(() => {
    setCount(count - 1)
  }, delay)

  useEffect(() => {
    if (count <= 0) {
      setDelay(null)
      setDisableBtn(false)
    }
  }, [count])

  const handleRequestOtpToken = async () => {
    if (delay !== null) {
      toast.error('錯誤 - 60s內無法重新獲得驗証碼')
      return
    }

    const res = await requestOtpToken(email)

    if (res.data.status === 'success') {
      toast.success('資訊 - 驗証碼已寄送到電子郵件中')
      setCount(60)
      setDelay(1000)
      setDisableBtn(true)
    } else {
      toast.error(`錯誤 - ${res.data.message}`)
    }
  }

  const handleResetPassword = async () => {
    const res = await resetPassword(email, password, token)

    if (res.data.status === 'success') {
      toast.success('資訊 - 密碼已成功修改')
      setTimeout(() => {
        router.push('/test/user')
      }, 2000)
    } else {
      toast.error(`錯誤 - ${res.data.message}`)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">忘記密碼</h2>

              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    電子郵件信箱
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleRequestOtpToken}
                    disabled={disableBtn}
                  >
                    {delay ? `${count}秒後可以再次取得驗証碼` : '取得驗証碼'}
                  </button>
                </div>
                <div className="mb-3">
                  <label htmlFor="token" className="form-label">
                    一次性驗証碼
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    新密碼
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={togglePasswordVisibility}
                      style={{ zIndex: 10 }}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleResetPassword}
                  >
                    重設密碼
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
          }
          .btn-success {
            background-color: #ff6433;
            color: #ffffff;
          }
          .h2 {
            font-family: 'Raleway', sans-serif;
          }
        `}
      </style>
      <Toaster />
    </div>
  )
}
