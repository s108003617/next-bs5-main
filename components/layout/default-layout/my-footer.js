import React from 'react';

export default function MyFooter() {
  return (
    <footer className="footer mt-5 py-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span className="text-muted">
              <i className="bi bi-geo-alt-fill"></i> 台灣 © 2024 DigitalShop Inc. 版權所有
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="#" className="text-muted me-2">關於我們</a>
            <a href="#" className="text-muted me-2">客戶服務</a>
            <a href="#" className="text-muted me-2">隱私政策</a>
            <a href="#" className="text-muted">聯絡我們</a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer {
          background: #45595b !important;
          color: #f8f9fa;
        }
        .footer a {
          color: #f8f9fa;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </footer>
  );
}