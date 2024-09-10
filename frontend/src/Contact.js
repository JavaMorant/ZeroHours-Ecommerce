import React, { useState } from "react";
import { contactConfig } from "./content_option";
import { Link } from 'react-router-dom';
import "./Contact.css";
import "./AboutUs.css";

export default function Contact() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    try {
      const response = await fetch(`${apiUrl}/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <div className="container-contact">
      <div className="main-contact-section">
        <h2 className="contact-heading">CONTACT US</h2>
        <hr className="t_border my-4 ml-0 text-left" />
        <div className="row sec_sp">
          <div className="col col-lg-5 mb-5">
            <h3 className="color_sec py-4">Get in touch</h3>
            <address>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${contactConfig.YOUR_EMAIL}`}>
                {contactConfig.YOUR_EMAIL}
              </a>
              <br /><br />
              {contactConfig.hasOwnProperty("YOUR_FONE") && (
                <p>
                  <strong>Phone:</strong> {contactConfig.YOUR_FONE}
                </p>
              )}
            </address>
            <p>{contactConfig.description}</p>
          </div>
          <div className="col col-lg-7 d-flex align-items-center">
            <form className="contact__form w-100" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col col-lg-6 form-group">
                  <input
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
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
                    value={formData.email}
                    onChange={handleInputChange}
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
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
              <br />
              <div className="row">
                <div className="col col-lg-12 form-group">
                  <button className="btn ac_btn" type="submit" disabled={submitStatus === 'sending'}>
                    {submitStatus === 'sending' ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
              {submitStatus === 'success' && <p className="success-message">Message sent successfully!</p>}
              {submitStatus === 'error' && <p className="error-message">Failed to send message. Please try again.</p>}
            </form>
          </div>
        </div>
      </div>

      <nav id="desktop-nav">
        <ul className="nav-links">
          <li><Link to="/shop">SHOP</Link></li>
          <li><Link to="/about">OUR MESSAGE</Link></li>
          <li><Link to="/sizeguide">SIZE GUIDE</Link></li>
          <li><Link to="/shipping">SHIPPING</Link></li>
          <li><Link to="/contact">CONTACT US</Link></li>
        </ul>
      </nav>

      <nav id="hamburger-nav-about">
        <div className="hamburger-menu-about">
          <div className={`hamburger-icon-about ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`menu-links-about ${menuOpen ? 'open' : ''}`}>
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

      <div id="cart-container-about">
        <img 
          src="./assets/img/icons8-cart-64.png" 
          alt="Cart" 
          className="icon" 
          onClick={() => window.location.href='/cart'} 
        />
      </div>

      <div id="logo-container-about">
        <Link to="/">
          <img src='./assets/img/logo_nobg.png' alt="Our Logo" className="logo" />
        </Link>
      </div>

      <div id="socials-container-about">
        <img 
          src="./assets/img/icons8-instagram-24.png" 
          alt="Our Instagram" 
          className="icon" 
          onClick={() => window.location.href='https://www.instagram.com/hourszer0/?hl=en'} 
        />
        <img 
          src="./assets/img/icons8-tiktok-24.png" 
          alt="Our TikTok" 
          className="icon" 
          onClick={() => window.location.href='https://www.tiktok.com/@hourszero'} 
        />

      </div>
    </div>
  );
}