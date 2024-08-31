import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BasketContext } from './BasketContext';
import './OrderConfirmation.css'; // You'll need to create this CSS file

const OrderConfirmation = () => {
  const { basket, setBasket } = useContext(BasketContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the basket after showing the confirmation
    return () => setBasket([]);
  }, [setBasket]);

  const calculateTotal = () => {
    return basket.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  if (basket.length === 0) {
    // Redirect to home if there's no order to confirm
    navigate('/');
    return null;
  }

  return (
    <div className="order-confirmation">
      <h1>Thank You for Your Order!</h1>
      <p>Your order has been received and is being processed.</p>

      <div className="order-details">
        <h2>Order Details</h2>
        <ul>
          {basket.map((item, index) => (
            <li key={index}>
              <span className="item-name">{item.name}</span>
              <span className="item-details">
                Size: {item.selectedSize}, Quantity: {item.quantity}, 
                Price: £{(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="order-total">
          <strong>Total: £{calculateTotal()}</strong>
        </div>
      </div>

      <p>An email confirmation has been sent to your email address.</p>

      <div className="next-steps">
        <h3>What's Next?</h3>
        <ul>
          <li>You will receive an email when your order ships.</li>
          <li>If you have any questions, please contact our customer service.</li>
        </ul>
      </div>

      <div className="navigation-links">
        <Link to="/" className="home-link">Return to Homepage</Link>
        <Link to="/shop" className="shop-link">Continue Shopping</Link>
      </div>

      {/* Navigation elements */}
      <nav id="desktop-nav">
        <ul className="nav-links">
          <li><Link to="/shop">SHOP</Link></li>
          <li><Link to="/about">OUR MESSAGE</Link></li>
          <li><Link to="/sizeguide">SIZE GUIDE</Link></li>
          <li><Link to="/shipping">SHIPPING</Link></li>
          <li><Link to="/contact">CONTACT US</Link></li>
        </ul>
      </nav>

      <div id="logo-container-about">
        <Link to="/">
          <img src='./assets/img/logo_nobg.png' alt="Our Logo" className="logo" />
        </Link>
      </div>

      <div id="socials-container-about">
        <img 
          src="./assets/img/icons8-instagram-24.png" 
          alt="Our Instagram" 
          className="icon" 
          onClick={() => window.open('https://www.instagram.com/yourinstagram', '_blank')} 
        />
        <img 
          src="./assets/img/icons8-tiktok-24.png" 
          alt="Our TikTok" 
          className="icon" 
          onClick={() => window.open('https://www.tiktok.com/@yourtiktok', '_blank')} 
        />
        <img 
          src="./assets/img/icons8-facebook-24.png" 
          alt="Our Facebook" 
          className="icon" 
          onClick={() => window.open('https://www.facebook.com/yourfacebook', '_blank')} 
        />
        <img 
          src="./assets/img/icons8-X-50.png" 
          alt="Our X" 
          className="icon" 
          onClick={() => window.open('https://twitter.com/yourtwitter', '_blank')} 
        />
      </div>
    </div>
  );
};

export default OrderConfirmation;