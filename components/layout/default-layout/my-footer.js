import React from 'react'

export default function MyFooter() {
  return (
    <footer className="footer mt-auto py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="text-muted">
              <i className="bi bi-geo-alt-fill"></i> 台灣 © 2024 DigitalShop
              Inc. 版權所有
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-muted text-md-end">
              <a href="#" className="pe-2">
                關於我們
              </a>
              <a href="#" className="pe-2">
                客戶服務
              </a>
              <a href="#" className="pe-2">
                隱私政策
              </a>
              <a href="#" className="pe-2">
                聯絡我們
              </a>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer {
          background: #45595b !important;
          color: #f8f9fa;
          border-top: 20px solid #ffffff; /* 半透明的頂部邊框 */
        }
        .footer a {
          color: #f8f9fa;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        @media (max-width: 767px) {
          .text-md-end {
            text-align: left !important;
          }
        }
      `}</style>
    </footer>
  )
}
