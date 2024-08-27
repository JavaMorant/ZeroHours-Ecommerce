import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const toggleMenu = () => {
  const menu = document.querySelector(".menu-links-about");
  const icon = document.querySelector(".hamburger-icon-about");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
};

const AboutUs = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    setIsLoggedIn(!!userToken);
  }, []);

  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <div className="text-section">
          <h1>ABOUT US</h1>
          <p>
            At Z Sportswear, we build our brand from the ground up with a singular focus: helping you elevate your fitness and fashion game. Our mission is to empower individuals by providing high-quality sportswear designed to support every step of your fitness journey. From our cutting-edge materials to our stylish designs, we are dedicated to helping you progress both physically and fashionably. Join us as we redefine what it means to be at the forefront of fitness and fashion.
          </p>
        </div>
        <div className="dropdown" onClick={() => toggleDropdown(1)}>
          <div className="dropdown-header">
            Our Mission
          </div>
          <div className={`dropdown-content ${openDropdown === 1 ? 'open' : ''}`}>
            <div className="dropdown-text">
              <p>
                Our mission is to inspire and support individuals in their journey towards a healthier lifestyle. We are committed to creating sportswear that not only performs well but also looks great. We believe that progress in fitness and fashion go hand in hand, and we strive to be your partner in achieving both.
              </p>
            </div>
            <div className="dropdown-image">
              <img src="./assets/img/0 HOURS-26.jpg" alt="Our Mission" />
            </div>
          </div>
        </div>
        <div className="dropdown" onClick={() => toggleDropdown(2)}>
          <div className="dropdown-header">
            Our Vision
          </div>
          <div className={`dropdown-content ${openDropdown === 2 ? 'open' : ''}`}>
            <div className="dropdown-text">
              <p>
                We envision a world where fitness and fashion seamlessly integrate, empowering individuals to look and feel their best. Our vision is to be a leading force in the sportswear industry, setting new standards in performance and style. We aim to inspire confidence and encourage a lifestyle that embraces both fitness and fashion.
              </p>
            </div>
            <div className="dropdown-image">
              <img src="./assets/img/0 HOURS-39.jpg" alt="Our Vision" />
            </div>
          </div>
        </div>
        <div className="dropdown" onClick={() => toggleDropdown(3)}>
          <div className="dropdown-header">
            Our Values
          </div>
          <div className={`dropdown-content ${openDropdown === 3 ? 'open' : ''}`}>
            <div className="dropdown-text">
              <p>
                We stand by values of innovation, quality, and integrity. Our commitment is to deliver exceptional products that meet the highest standards of performance and design. We value transparency and sustainability, ensuring that our practices contribute positively to the community and environment. Our goal is to build lasting relationships with our customers based on trust and mutual respect.
              </p>
            </div>
            <div className="dropdown-image">
              <img src="./assets/img/0 HOURS-19.jpg" alt="Our Values" />
            </div>
          </div>
        </div>
      </div>
      <nav id="desktop-nav">
        <div>
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
        </div>
      </nav>
      <nav id='hamburger-nav-about'>
        <div className="hamburger-menu-about">
          <div className="hamburger-icon-about" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="menu-links-about">
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
          </div>
        </div>
      </nav>
      <div id='cart-container-about'>
        <img src="./assets/img/icons8-cart-64.png" alt="Cart" className="icon" onClick={() => window.location.href='/cart'} onMouseEnter={() => setShowCartDropdown(true)} onMouseLeave={() => setShowCartDropdown(false)} />
      </div>
      <div id="logo-container-about">
        <Link to="/">
          <img src='./assets/img/logo_nobg.png' alt="Our Logo" className="logo" />
        </Link>
      </div>
      <div id="socials-container-about">
        <img src="./assets/img/icons8-instagram-24.png" alt="Our Instagram" className="icon" onClick={() => window.location.href='https://linkedin.com/in/joseph-macgowan-4a60a42b5'} />
        <img src="./assets/img/icons8-tiktok-24.png" alt="Our TikTok" className="icon" onClick={() => window.location.href='https://www.tiktok.com/@hourszero'} />
        <img src="./assets/img/icons8-facebook-24.png" alt="Our Facebook" className="icon" onClick={() => window.location.href='https://linkedin.com/in/joseph-macgowan-4a60a42b5'} />
        <img src="./assets/img/icons8-X-50.png" alt="Our X" className="icon" onClick={() => window.location.href='https://linkedin.com/in/joseph-macgowan-4a60a42b5'} />
      </div>
    </div>
  );
};

export default AboutUs;
