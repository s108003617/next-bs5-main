import React, { useState, useEffect } from 'react'
import {
  updateProfile,
  getUserById,
  updateProfileAvatar,
  logout,
} from '@/services/user'
import { useAuth } from '@/hooks/use-auth'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PreviewUploadImage from '@/components/user-test/preview-upload-image'
import { avatarBaseUrl } from '@/configs'

const initUserProfile = {
  name: '',
  sex: '',
  phone: '',
  birth_date: '',
  avatar: '',
}

export default function Profile() {
  const { auth, setAuth } = useAuth()
  const [userProfile, setUserProfile] = useState(initUserProfile)
  const [hasProfile, setHasProfile] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isPhoneValid, setIsPhoneValid] = useState(true)
  const router = useRouter()

  const getUserData = async (id) => {
    const res = await getUserById(id)
    if (res.data.status === 'success') {
      const dbUser = res.data.data.user
      const dbUserProfile = { ...initUserProfile }
      for (const key in dbUserProfile) {
        if (Object.hasOwn(dbUser, key)) {
          dbUserProfile[key] = dbUser[key] || ''
        }
      }
      setUserProfile(dbUserProfile)
      toast.success('會員資料載入成功')
    } else {
      toast.error('會員資料載入失敗')
    }
  }

  useEffect(() => {
    if (auth.isAuth) {
      getUserData(auth.userData.id)
    }
  }, [auth])

  useEffect(() => {
    if (userProfile.name) {
      setHasProfile(true)
    }
  }, [userProfile])

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setUserProfile({ ...userProfile, [name]: value })

    if (name === 'phone') {
      const phoneRegex = /^09\d{8}$/
      setIsPhoneValid(phoneRegex.test(value))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isPhoneValid) {
      toast.error('請輸入有效的手機號碼')
      return
    }
    const { avatar, ...user } = userProfile
    const res = await updateProfile(auth.userData.id, user)

    if (selectedFile) {
      const formData = new FormData()
      formData.append('avatar', selectedFile)
      const res2 = await updateProfileAvatar(formData)
      if (res2.data.status === 'success') {
        toast.success('會員頭像修改成功')
        // Update the auth context with the new avatar
        setAuth(prevAuth => ({
          ...prevAuth,
          userData: {
            ...prevAuth.userData,
            avatar: res2.data.data.avatar
          }
        }))
      }
    }

    if (res.data.status === 'success') {
      toast.success('會員資料修改成功')
      // Update the auth context with the new user data
      setAuth(prevAuth => ({
        ...prevAuth,
        userData: {
          ...prevAuth.userData,
          name: user.name,
          email: user.email,
          // Only update fields that are part of initUserData
        }
      }))
    } else {
      toast.error('會員資料修改失敗')
    }
  }

  const handleLogout = async () => {
    const res = await logout()
    if (res.data.status === 'success') {
      toast.success('已成功登出')
      setAuth({ isAuth: false, userData: initUserProfile })
      router.push('/test/user')
    } else {
      toast.error('登出失敗')
    }
  }

  if (!auth.isAuth) return null
  return (
    <div className="container-fluid">
      <div className="row">
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
            <h1 className="h2">會員資料</h1>
          </div>

          <div className="mb-4">
            {hasProfile ? (
              <PreviewUploadImage
                avatarImg={userProfile.avatar}
                avatarBaseUrl={avatarBaseUrl}
                setSelectedFile={setSelectedFile}
                selectedFile={selectedFile}
              />
            ) : (
              <div>
                <img
                  src="/blank.webp"
                  alt=""
                  width="200"
                  height="200"
                  className="img-fluid"
                />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                姓名
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={userProfile.name}
                onChange={handleFieldChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">姓別</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sex"
                    id="male"
                    value="男"
                    checked={userProfile.sex === '男'}
                    onChange={handleFieldChange}
                  />
                  <label className="form-check-label" htmlFor="male">
                    男
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sex"
                    id="female"
                    value="女"
                    checked={userProfile.sex === '女'}
                    onChange={handleFieldChange}
                  />
                  <label className="form-check-label" htmlFor="female">
                    女
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                手機
              </label>
              <input
                type="text"
                className={`form-control ${!isPhoneValid ? 'is-invalid' : ''}`}
                id="phone"
                name="phone"
                value={userProfile.phone}
                onChange={handleFieldChange}
                maxLength={10}
              />
              {!isPhoneValid && (
                <div className="invalid-feedback">
                  請輸入有效的手機號碼 
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="birth_date" className="form-label">
                生日
              </label>
              <input
                type="date"
                className="form-control"
                id="birth_date"
                name="birth_date"
                value={userProfile.birth_date}
                onChange={handleFieldChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              修改
            </button>
          </form>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
