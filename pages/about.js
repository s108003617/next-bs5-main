import React from 'react';
import { Accordion, Card, Button, ProgressBar } from 'react-bootstrap';

const About = () => {
  return (
    <div className="container py-5">
      <div className="row mb-5 align-items-center">
        <div className="col-md-8">
          <h1 className="display-4 mb-4">關於我們</h1>
          <p className="lead">
            Digital Shop 是您的終極 3C 產品線上購物天堂。我們致力於為科技愛好者提供最新、最優質的數碼產品。
          </p>
        </div>
        <div className="col-md-4 text-center">
          <i className="bi bi-shop text-primary" style={{ fontSize: '8rem' }}></i>
        </div>
      </div>

      <section className="mb-5">
        <h2 className="h2 mb-4">我們的特色</h2>
        <div className="row">
          {[
            { name: '專業3C商城', icon: 'bi-laptop' },
            { name: '便捷購物體驗', icon: 'bi-cart-check' },
            { name: '個人化收藏', icon: 'bi-heart' },
            { name: '完善訂單管理', icon: 'bi-list-check' },
            { name: '智能商品搜尋', icon: 'bi-search' }
          ].map((feature, index) => (
            <div key={index} className="col-md-4 mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <i className={`bi ${feature.icon} text-primary mb-3`} style={{ fontSize: '2rem' }}></i>
                  <Card.Title>{feature.name}</Card.Title>
                  <Card.Text>
                    為您提供最佳的{feature.name}體驗，讓購物變得更簡單、更愉快。
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <h2 className="h2 mb-4">我們的成長</h2>
        <div className="row align-items-center">
          <div className="col-md-7">
            <p>在過去的幾年裡，我們在各個方面都取得了顯著的進步：</p>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>客戶滿意度</span>
                <span>95%</span>
              </div>
              <ProgressBar now={95} variant="success" />
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>產品種類</span>
                <span>80%</span>
              </div>
              <ProgressBar now={80} variant="info" />
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>技術創新</span>
                <span>90%</span>
              </div>
              <ProgressBar now={90} variant="warning" />
            </div>
          </div>
          <div className="col-md-5 text-center">
            <i className="bi bi-graph-up-arrow text-success" style={{ fontSize: '8rem' }}></i>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <h2 className="h2 mb-4">常見問題</h2>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <i className="bi bi-person-plus me-2"></i>
              如何創建帳戶？
            </Accordion.Header>
            <Accordion.Body>
              點擊網站右上角的「註冊」按鈕，填寫必要信息即可輕鬆創建帳戶。整個過程不到5分鐘！
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <i className="bi bi-credit-card me-2"></i>
              你們提供哪些支付方式？
            </Accordion.Header>
            <Accordion.Body>
              我們支持多種支付方式，包括信用卡、Line Pay、街口支付等。您可以在結帳時選擇最適合您的支付方式。
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <i className="bi bi-headset me-2"></i>
              如何聯繫客服？
            </Accordion.Header>
            <Accordion.Body>
              您可以通過電子郵件、在線聊天或電話聯繫我們的客服團隊。我們的服務時間為週一至週五 9:00-18:00。
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </section>

      <section>
        <h2 className="h2 mb-4">聯繫我們</h2>
        <div className="row">
          <div className="col-md-6">
            <address>
              <p><i className="bi bi-telephone me-2"></i><strong>客服電話：</strong> 0800-123-456</p>
              <p><i className="bi bi-envelope me-2"></i><strong>電子郵件：</strong> <a href="mailto:info@digitalshop.com">info@digitalshop.com</a></p>
              <p><i className="bi bi-clock me-2"></i><strong>營業時間：</strong> 週一至週五 9:00-18:00</p>
            </address>
          </div>
          <div className="col-md-6">
            <Button variant="primary" size="lg" className="mb-3 me-3">
              <i className="bi bi-chat-text me-2"></i>立即聯繫
            </Button>
            <Button variant="outline-secondary" size="lg" className="mb-3">
              <i className="bi bi-question-circle me-2"></i>查看常見問題
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;