import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import "./SizeGuide.css";
import "./AboutUs.css";

export default function SizeGuide() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const iconRef = useRef(null);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  // Function to toggle menu visibility
  const toggleMenu = () => {
    if (menuRef.current && iconRef.current) {
      menuRef.current.classList.toggle("open");
      iconRef.current.classList.toggle("open");
      setMenuOpen(!menuOpen);
    }
  };

  // Check login status on component mount
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    setIsLoggedIn(!!userToken);
  }, []);

  return (
    <div className="container-size-guide">
      {/* Main Size Guide Section */}
      <div className="main-size-guide-section">
        <h2 className="size-guide-heading">
          SIZE GUIDE
        </h2>
        <hr className="t_border my-4 ml-0 text-left" />
        <div className="row">
          {/* Size Guide Images */}
          <div className="size-guide-images-container col col-lg-12">
            <div className="size-guide-images">
              <img src="./assets/img/tshirts.jpeg" alt="T-Shirts Size Guide" className="size-guide-image" />
              <img src="./assets/img/shorts.jpeg" alt="Shorts Size Guide" className="size-guide-image" />
            </div>
          </div>
        </div>
      </div>

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
          <div className="hamburger-icon-about" onClick={toggleMenu} ref={iconRef}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="menu-links-about" ref={menuRef}>
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
}
