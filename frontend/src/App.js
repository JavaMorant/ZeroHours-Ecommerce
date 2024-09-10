import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if the app has been loaded before
    const hasLoaded = localStorage.getItem('hasLoaded');

    if (!hasLoaded) {
      // Simulate a loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('hasLoaded', 'true');
      }, 0);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (videoRef.current && !isIOS) {
      videoRef.current.play();
    }
  }, []);

  const toggleMenu = () => {
    const menu = document.querySelector(".menu-links-app");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <video
        ref={videoRef}
        className="background-video"
        autoPlay
        muted
        loop
        playsInline={/iPad|iPhone|iPod/.test(navigator.userAgent)}
      >
        <source src="/Assets/vids/TrailerLarge.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Desktop Navigation */}
      <nav id="desktop-nav">
        <div>
          <ul className="nav-links-app">
            <li><Link to="/shop">SHOP</Link></li>
            <li><Link to="/about">OUR MESSAGE</Link></li>
            <li><Link to="/sizeguide">SIZE GUIDE</Link></li>
            <li><Link to="/shipping">SHIPPING</Link></li>
            <li><Link to="/contact">CONTACT US</Link></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav id="hamburger-nav">
        <div className="hamburger-menu">
          <div className="hamburger-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="menu-links-app">
            <li><Link to="/shop" onClick={toggleMenu}>Shop</Link></li>
            <li><Link to="/about" onClick={toggleMenu}>Our Message</Link></li>
            <li><Link to="/sizeguide" onClick={toggleMenu}>Size Guide</Link></li>
            <li><Link to="/shipping" onClick={toggleMenu}>Shipping</Link></li>
            <li><Link to="/contact" onClick={toggleMenu}>Contact Us</Link></li>
          </div>
        </div>
      </nav>

      {/* Shop Link */}
      <div id="shop-container">
        <h1>
          <Link to="/shop">
            <i>SHOP</i>
          </Link>
        </h1>
      </div>

      {/* Cart Icon with Dropdown */}
      <div id="cart-container">
        <img
          src="./assets/img/icons8-cart-64.png"
          alt="Cart"
          className="icon"
          onClick={() => navigate('/cart')}
          onMouseEnter={() => setShowCartDropdown(true)}
          onMouseLeave={() => setShowCartDropdown(false)}
        />
        {showCartDropdown && (
          <div className="cart-dropdown">
            {/* Add cart items or a mini-cart preview here */}
          </div>
        )}
      </div>

      {/* Logo */}
      <div id="logo-container">
        <Link to="/">
          <img src="./assets/img/logo_nobg.png" alt="Logo" className="logo" />
        </Link>
      </div>

      {/* Social Media Icons */}
      <div id="socials-container">
        <img src="./assets/img/icons8-instagram-24.png" alt="Instagram" className="icon" onClick={() => window.open('https://www.instagram.com/hourszer0/?hl=en', '_blank')} />
        <img src="./assets/img/icons8-tiktok-24.png" alt="TikTok" className="icon" onClick={() => window.open('https://www.tiktok.com/@hourszero?_t=8pY784vTQw4&_r=1', '_blank')} />
      </div>
    </div>
  );
}

export default App;
