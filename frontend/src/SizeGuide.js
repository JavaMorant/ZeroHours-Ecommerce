import React, { useState, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';

import "./SizeGuide.css";
import "./AboutUs.css";

export default function SizeGuide() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const iconRef = useRef(null);

  // Function to toggle menu visibility
  const toggleMenu = () => {
    if (menuRef.current && iconRef.current) {
      menuRef.current.classList.toggle("open");
      iconRef.current.classList.toggle("open");
      setMenuOpen(!menuOpen);
    }
  };

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
          onClick={() => window.open('https://linkedin.com/in/joseph-macgowan-4a60a42b5', '_blank')} 
        />
        <img 
          src="./assets/img/icons8-tiktok-24.png" 
          alt="Our TikTok" 
          className="icon" 
          onClick={() => window.open('https://www.tiktok.com/@hourszero', '_blank')} 
        />
        <img 
          src="./assets/img/icons8-facebook-24.png" 
          alt="Our Facebook" 
          className="icon" 
          onClick={() => window.open('https://linkedin.com/in/joseph-macgowan-4a60a42b5', '_blank')} 
        />
        <img 
          src="./assets/img/icons8-X-50.png" 
          alt="Our X" 
          className="icon" 
          onClick={() => window.open('https://linkedin.com/in/joseph-macgowan-4a60a42b5', '_blank')} 
        />
      </div>
    </div>
  );
}