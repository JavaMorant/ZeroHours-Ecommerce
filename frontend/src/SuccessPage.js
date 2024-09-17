import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BasketContext } from './BasketContext';
import './CheckoutResult.css'; // Ensure your CSS file paths are correct

const SuccessPage = () => {
  const { setBasket } = useContext(BasketContext);
  const [menuOpen, setMenuOpen] = useState(false); // Correct useState hook initialization

  useEffect(() => {
    // Clear the basket after successful payment
    setBasket([]);
  }, [setBasket]);

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  return (
    <div>
      <div className="checkout-result success">
        <h1>Thank You for Your Order!</h1>
        <p>Your payment was successful and your order is being processed.</p>
        <p>You will receive an email confirmation shortly.</p>
        <div className="order-actions">
          <Link to="/" className="btn btn-primary">Return to Home</Link>
          <Link to="/shop" className="btn btn-secondary">Continue Shopping</Link>
        </div>
      </div>

      {/* Navigation Menus */}
      <nav id="desktop-nav">
        <ul className="nav-links">
          <li><Link to="/shop">SHOP</Link></li>
          <li><Link to="/about">OUR MESSAGE</Link></li>
          <li><Link to="/sizeguide">SIZE GUIDE</Link></li>
          <li><Link to="/shipping">SHIPPING</Link></li>
          <li><Link to="/contact">CONTACT US</Link></li>
        </ul>
      </nav>

      {/* Hamburger Menu */}
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

      {/* Cart Icon */}
      <div id="cart-container-about">
        <img 
          src="/assets/img/icons8-cart-64.png" 
          alt="Cart" 
          className="icon" 
          onClick={() => window.location.href='/cart'} 
        />
      </div>

      {/* Logo */}

 
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
           onClick={() => window.location.href='https://www.instagram.com/hourszer0/?hl=en'} 
         />
         <img 
           src="./assets/img/icons8-tiktok-24.png" 
           alt="Our TikTok" 
           className="icon" 
           onClick={() => window.location.href='https://www.tiktok.com/@hourszero'} 
         />
       </div>
     </div>
  );
};

export default SuccessPage;