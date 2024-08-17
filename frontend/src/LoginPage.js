import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClients from "./httpClients.ts";
import "./LoginPage.css";
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
        // Register logic remains the same
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
      <div className="logo-container">
        <img src="/path-to-your-logo.png" alt="Logo" />
      </div>
      
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
    </div>
  );
}

export default LoginPage;