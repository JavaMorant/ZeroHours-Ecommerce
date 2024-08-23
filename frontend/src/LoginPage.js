import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import httpClients from "./httpClients.ts";
import "./LoginPage.css";
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();


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
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      if (isSignUp) {
        const response = await httpClients.post("/register", { email, password });
        setSuccessMessage("Registration successful. Please check your email to verify your account.");
      } else {
        const response = await httpClients.post("/login", { email, password });
        if (response.data.isAuthenticated) {
          login(response.data.id); // Use the login function from AuthContext 
          navigate("/"); // Redirect to home page after successful login
        } else {
          setErrorMessage(response.data.error || "An error occurred during login.");
        }
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error || "An error occurred. Please try again.");
      } else {
        setErrorMessage("Network error. Please check your connection and try again.");
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="login-page-wrapper">
      
      <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icons"><i className='bx bxl-google'></i></a>
              <a href="#" className="icons"><i className='bx bxl-facebook'></i></a>
              <a href="#" className="icons"><i className='bx bxl-github'></i></a>
              <a href="#" className="icons"><i className='bx bxl-linkedin'></i></a>
            </div>
            <span>Register with E-mail</span>
            <input 
              type="text" 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
            <input 
              type="email" 
              placeholder="Enter E-mail" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <button type="submit">Sign Up</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </form>
        </div>
  
        <div className="form-container sign-in">
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icons"><i className='bx bxl-google'></i></a>
              <a href="#" className="icons"><i className='bx bxl-facebook'></i></a>
              <a href="#" className="icons"><i className='bx bxl-github'></i></a>
              <a href="#" className="icons"><i className='bx bxl-linkedin'></i></a>
            </div>
            <span>Login With Email & Password</span>
            <input 
              type="email" 
              placeholder="Enter E-mail" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <a href="#">Forget Password?</a>
            <button type="submit">Sign In</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        </div>
  
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Sign in with your personal info to stay connected with us</p>
              <button className="hidden" onClick={toggleMode}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="hidden" onClick={toggleMode}>Sign Up</button>
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

export default LoginPage;