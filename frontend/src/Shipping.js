import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import httpClients from './httpClients.ts'; 
import './Shipping.css';
import './AboutUs.css';

const Shipping = () => {
  const [, setBasket] = useState([]);
  const [isLoggedIn, logout] = useState(false);
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

  useEffect(() => {
    const initializeBasket = async () => {
      const userToken = localStorage.getItem('userToken');

      if (userToken) {
        try {
          const response = await httpClients.get("//127.0.0.1:5000/api/get-basket");
          setBasket(response.data.basket);
        } catch (error) {
          console.error("Error fetching basket:", error);
        }
      } else {
        const savedBasket = localStorage.getItem('basket');
        if (savedBasket) {
          setBasket(JSON.parse(savedBasket));
        }
      }
    };

    initializeBasket();
  }, []);


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
          {isLoggedIn ? (
            <>
              <li><Link to="/account">ACCOUNT</Link></li>
              <li><Link to="/" onClick={handleLogout}>LOGOUT</Link></li>
            </>
          ) : (
            <li><Link to="/login">LOGIN</Link></li>
          )}
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
            {isLoggedIn ? (
                <>
                  <li><Link to="/account" onClick={toggleMenu}>Account</Link></li>
                  <li><Link to="/" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</Link></li>
                </>
              ) : (
                <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
              )}
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
          onClick={() => window.location.href='/cart'} 
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
    </div>
  );
};

export default Shipping;
