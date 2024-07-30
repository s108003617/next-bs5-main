import MyNavbarBS5 from './my-navbar'
import MyFooter from './my-footer'
import Head from 'next/head'
import NextBreadCrumb from '@/components/common/next-breadcrumb'
import { useLoader } from '@/hooks/use-loader'
import { useRouter } from 'next/router'

export default function DefaultLayout({ title = 'DigitalShop', children }) {
  const { loader } = useLoader()
  const router = useRouter()

  // 檢查當前路徑是否為首頁
  const isHomePage = router.pathname === '/'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <MyNavbarBS5 />
      <main className="flex-shrink-0 mt-3">
        <div className="container">
          {!isHomePage && ( // 只有在非首頁時顯示麵包屑
            <NextBreadCrumb isHomeIcon isChevron bgClass="" />
          )}
          {children}
        </div>
        {/* 全域的載入動畫指示器 */}
        {loader()}
      </main>
      <MyFooter />
    </>
  )
}