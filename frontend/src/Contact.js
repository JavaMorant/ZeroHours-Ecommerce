import React, { useState, useEffect } from "react";
import { contactConfig } from "./content_option";
import { Link } from 'react-router-dom';
import "./Contact.css";

export default function Contact() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    setIsLoggedIn(!!userToken);
  }, []);

  return (
    <div className="container-contact">
      {/* Main Contact Section */}
      <div className="main-contact-section">
        <h2 className="contact-heading">
          CONTACT US
        </h2>
        <hr className="t_border my-4 ml-0 text-left" />
        <div className="row sec_sp">
          <div className="col col-lg-5 mb-5">
            <h3 className="color_sec py-4">Get in touch</h3>
            <address>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contactConfig.YOUR_EMAIL}`}>
                {contactConfig.YOUR_EMAIL}
              </a>
              <br />
              <br />
              {contactConfig.hasOwnProperty("YOUR_FONE") && (
                <p>
                  <strong>Phone:</strong> {contactConfig.YOUR_FONE}
                </p>
              )}
            </address>
            <p>{contactConfig.description}</p>
          </div>
          <div className="col col-lg-7 d-flex align-items-center">
            <form className="contact__form w-100">
              <div className="row">
                <div className="col col-lg-6 form-group">
                  <input
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Name"
                    type="text"
                    required
                  />
                </div>
                <div className="col col-lg-6 form-group">
                  <input
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    required
                  />
                </div>
              </div>
              <textarea
                className="form-control"
                id="message"
                name="message"
                placeholder="Message"
                rows="5"
                required
              ></textarea>
              <br />
              <div className="row">
                <div className="col col-lg-12 form-group">
                  <button className="btn ac_btn" type="submit">
                    Send
                  </button>
                </div>
              </div>
            </form>
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
          <div className="hamburger-icon-about" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {menuOpen && (
            <div className="menu-links-about">
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
          )}
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
