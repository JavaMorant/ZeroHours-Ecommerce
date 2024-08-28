import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingScreen from './LoadingScreen';
import './App.css';

function App() {
  const { isLoggedIn, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [, setShowCartDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasLoaded = localStorage.getItem('hasLoaded');

    if (!hasLoaded) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('hasLoaded', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <video className="background-video" autoPlay loop muted>
        <source src={"./Assets/vids/trailerLarge.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <nav id="desktop-nav">
        <div>
          <ul className="nav-links-app">
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
      <nav id='hamburger-nav'>
        <div className="hamburger-menu">
          <div className="hamburger-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`menu-links-app ${menuOpen ? 'open' : ''}`}>
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
          </div>
        </div>
      </nav>
      <div id='shop-container'>
        <h1>
          <Link to="/shop">
            <i>SHOP</i>
          </Link>
        </h1>
      </div>

      <div id='cart-container'>
        <img 
          src="./assets/img/icons8-cart-64.png" 
          alt="Cart" 
          className="icon" 
          onClick={() => navigate('/cart')}   
          onMouseEnter={() => setShowCartDropdown(true)} 
          onMouseLeave={() => setShowCartDropdown(false)}
        />
      </div>
      <div id="logo-container">
        <img src='./assets/img/logo_nobg.png' alt="Logo" className="logo"/>
      </div>
      <div id="socials-container">
        <img src="./assets/img/icons8-instagram-24.png" alt="Instagram" className="icon" onClick={() => window.open('https://linkedin.com/in/joseph-macgowan-4a60a42b5', '_blank')}/>
        <img src="./assets/img/icons8-tiktok-24.png" alt="TikTok" className="icon" onClick={() => window.open('https://linkedin.com/in/joseph-macgowan-4a60a42b5', '_blank')}/>
        <img src="./assets/img/icons8-facebook-24.png" alt="Facebook" className="icon" onClick={() => window.open('https://linkedin.com/in/joseph-macgowan-4a60a42b5', '_blank')}/>
        <img src="./assets/img/icons8-X-50.png" alt="X" className="icon" onClick={() => window.open('https://linkedin.com/in/joseph-macgowan-4a60a42b5', '_blank')}/>
      </div>
    </div>
  );
}

export default App;