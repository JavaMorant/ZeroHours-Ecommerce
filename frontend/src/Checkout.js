import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { BasketContext } from './BasketContext';
import { loadStripe } from '@stripe/stripe-js';
import "./Checkout.css";

// Make sure to replace with your actual publishable key
const stripePromise = loadStripe('pk_test_51PpWYO2Lpl1R0iboJQ53cfJkTYtZD5ed7IpAdHvVghxBQcvh2UjwtQE0AksqPTKKjLPMJ0GryqTZH3CVjSKAorKh00AMEf0Py3');

const ProductDisplay = ({ basket, total, onCheckout }) => (
  <section className="product-display">
    <h2>Your Order Summary</h2>
    {basket.map((item, index) => (
      <div key={index} className="product">
        <img src={item.photo} alt={item.name} />
        <div className="description">
          <h3>{item.name}</h3>
          <p>Size: {item.selectedSize}</p>
          <p>Quantity: {item.quantity}</p>
          <h5>£{(item.price * item.quantity).toFixed(2)}</h5>
        </div>
      </div>
    ))}
    <div className="total">
      <h3>Total: £{total.toFixed(2)}</h3>
    </div>
    <button onClick={onCheckout}>
      Proceed to Payment
    </button>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function Checkout() {
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { basket, setBasket } = useContext(BasketContext);
  const navigate = useNavigate();

  const total = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
      setBasket([]); 
      setTimeout(() => navigate('/'), 3000);
    }
    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
      setTimeout(() => navigate('/shop'), 3000); 
    }
  }, [setBasket, navigate]);

  const handleSubmit = async (event) => {
    
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: basket.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    });

    const { id } = await response.json();

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: id,
    });

    if (error) {
      console.log(error);
      setMessage("An error occurred. Please try again.");
    } else {
      console.log("yay")
    }
  };

  if (basket.length === 0 && !message) {
    navigate('/shop');
    return null;
  }

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };
  return (
    <>
      {message ? (
        <Message message={message} />
      ) : (
        <ProductDisplay basket={basket} total={total} onCheckout={handleSubmit} />
      )}
      
      <nav id="desktop-nav">
        <ul className="nav-links">
          <li><Link to="/shop">SHOP</Link></li>
          <li><Link to="/about">OUR MESSAGE</Link></li>
          <li><Link to="/sizeguide">SIZE GUIDE</Link></li>
          <li><Link to="/shipping">SHIPPING</Link></li>
          <li><Link to="/contact">CONTACT US</Link></li>
        </ul>
      </nav>

      <nav id="hamburger-nav-about">
        <div className="hamburger-menu-about">
          <div className={`hamburger-icon-about ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`menu-links-about ${menuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/shop" onClick={toggleMenu}>Shop</Link></li>
              <li><Link to="/about" onClick={toggleMenu}>Our Message</Link></li>
              <li><Link to="/sizeguide" onClick={toggleMenu}>Size Guide</Link></li>
              <li><Link to="/shipping" onClick={toggleMenu}>Shipping</Link></li>
              <li><Link to="/contact" onClick={toggleMenu}>Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <div id="cart-container-about">
        <img 
          src="./assets/img/icons8-cart-64.png" 
          alt="Cart" 
          className="icon" 
          onClick={() => window.location.href='/cart'} 
        />
      </div>

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
          onClick={() => window.location.href='https://linkedin.com/in/joseph-macgowan-4a60a42b5'} 
        />
        <img 
          src="./assets/img/icons8-tiktok-24.png" 
          alt="Our TikTok" 
          className="icon" 
          onClick={() => window.location.href='https://www.tiktok.com/@hourszero'} 
        />
        <img 
          src="./assets/img/icons8-facebook-24.png" 
          alt="Our Facebook" 
          className="icon" 
          onClick={() => window.location.href='https://linkedin.com/in/joseph-macgowan-4a60a42b5'} 
        />
        <img 
          src="./assets/img/icons8-X-50.png" 
          alt="Our X" 
          className="icon" 
          onClick={() => window.location.href='https://linkedin.com/in/joseph-macgowan-4a60a42b5'} 
        />
      </div>
    </>
  );
}
