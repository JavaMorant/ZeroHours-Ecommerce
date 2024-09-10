import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Shipping.css';
import './AboutUs.css';

const Shipping = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Refs for the menu and hamburger icon
  const menuRef = useRef(null);
  const iconRef = useRef(null);

  // Predefined shipping info for UK, EU, and non-EU regions
  const shippingRates = [
    {
      region: 'United Kingdom',
      flag: '💂',
      price: '5.99',
      estimated_time: '2-3 Business Days'
    },
    {
      region: 'European Union',
      flag: '✈️',
      price: '9.99',
      estimated_time: '5-7 Business Days'
    },
    {
      region: 'Non-EU Countries',
      flag: '🌍',
      price: '14.99',
      estimated_time: '7-10 Business Days'
    }
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="shipping-container">
      {/* Shipping Prices Title */}
      <h2 className="shipping-title">SHIPPING PRICES</h2>

      {/* Shipping Information Table */}
      <table className="shipping-table">
        <thead>
          <tr>
            <th>Region</th>
            <th>Shipping Price</th>
            <th>Estimated Delivery Time</th>
          </tr>
        </thead>
        <tbody>
          {shippingRates.map((rate, index) => (
            <tr key={index}>
              <td className="flag-region">
                <span className="flag">{rate.flag}</span>
                <span className="region-name">{rate.region}</span>
              </td>
              <td>£{rate.price}</td>
              <td>{rate.estimated_time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Desktop Navigation */}
      <nav id="desktop-nav">
        <ul className="nav-links">
          <li><Link to="/shop">SHOP</Link></li>
          <li><Link to="/about">OUR MESSAGE</Link></li>
          <li><Link to="/sizeguide">SIZE GUIDE</Link></li>
          <li><Link to="/shipping">SHIPPING</Link></li>
          <li><Link to="/contact">CONTACT US</Link></li>
        </ul>
      </nav>

      {/* Hamburger Navigation for Mobile */}
      <nav id="hamburger-nav-about">
        <div className="hamburger-menu-about">
          <div 
            className={`hamburger-icon-about ${menuOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
            ref={iconRef}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div 
            className={`menu-links-about ${menuOpen ? 'open' : ''}`} 
            ref={menuRef}
          >
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
          src="./assets/img/icons8-cart-64.png" 
          alt="Cart" 
          className="icon" 
          onClick={() => navigate('/cart')} 
        />
      </div>

      {/* Logo */}
      <div id="logo-container-about">
        <Link to="/">
          <img src='./assets/img/logo_nobg.png' alt="Our Logo" className="logo" />
        </Link>
      </div>

      {/* Social Media Links */}
      <div id="socials-container-about">
        <img 
          src="./assets/img/icons8-instagram-24.png" 
          alt="Our Instagram" 
          className="icon" 
          onClick={() => window.open('https://www.instagram.com/hourszer0/?hl=en', '_blank')} 
        />
        <img 
          src="./assets/img/icons8-tiktok-24.png" 
          alt="Our TikTok" 
          className="icon" 
          onClick={() => window.open('https://www.tiktok.com/@hourszero', '_blank')} 
        />
      </div>
    </div>
  );
};

export default Shipping;