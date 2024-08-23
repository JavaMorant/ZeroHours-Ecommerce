import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';
import httpClient from './httpClients.ts';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Checkout from './Checkout.js';


const Cart = () => {
  const [basket, setBasket] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  // const [error, setError] = useState

  useEffect(() => {
    const fetchBasket = async () => {
      if (isLoggedIn) {
        try {
          const response = await httpClient.get("/get-basket");
          setBasket(response.data.basket);
        } catch (error) {
          console.error("Error fetching basket:", error);

        }
      } else {
        console.log("NOPE")
        const savedBasket = localStorage.getItem('basket');
        if (savedBasket) {
          setBasket(JSON.parse(savedBasket));
        }
      }
    };

    fetchBasket();
  }, [isLoggedIn]);

  const updateBasket = async (updatedBasket) => {
    setBasket(updatedBasket);

    if (isLoggedIn) {
      try {
        await httpClient.post("/update-basket", { basket: updatedBasket });
      } catch (error) {
        console.error("Error updating server basket:", error);
      }
    } else {
      localStorage.setItem('basket', JSON.stringify(updatedBasket));
    }
  };

  const handleQuantityChange = (productId, selectedSize, newQuantity) => {
    const updatedBasket = basket.map(item =>
      item.id === productId && item.selectedSize === selectedSize
        ? { ...item, quantity: Math.max(1, newQuantity) } // Ensure quantity is at least 1
        : item
    );
  
    updateBasket(updatedBasket);
  };

  const handleRemoveItem = (productId, selectedSize) => {
    const updatedBasket = basket.filter(item => 
      !(item.id === productId && item.selectedSize === selectedSize)
    );
    updateBasket(updatedBasket);
  };

  const handleCheckout = () => {
    // Verify user is logged in first
    if (!isLoggedIn) {
      toast.error('You must be logged in to checkout.');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  }

  const calculateTotal = () => {
    return basket.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    alert('Logging out!');
    localStorage.removeItem('userToken');
    logout();
  };

  return (
    <div>
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
                <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                <li><Link to="/shop" onClick={toggleMenu}>Shop</Link></li>
                <li><Link to="/about" onClick={toggleMenu}>Our Message</Link></li>
                <li><Link to="/contact" onClick={toggleMenu}>Contact Us</Link></li>
              </ul>
            </div>
          )}
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
          <img src="./assets/img/logo_nobg.png" alt="Our Logo" className="logo" />
        </Link>
      </div>
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
      <div className="cart-container">
        <h2>Your Basket</h2>
        {basket.length === 0 ? (
          <p>Your basket is empty.</p>
        ) : (
          <>
            <ul className="basket-items">
              {basket.map((item, index) => (
                <li key={index} className="basket-item">
                  <img src={item.photo} alt={item.name} className="basket-item-image" />
                  <div className="basket-item-details">
                    <h3>{item.name}</h3>
                    <p>Size: {item.selectedSize}</p>
                    <div className="quantity-controls">
                      <label htmlFor={`quantity-${index}`}>Quantity:</label>
                      <input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, item.selectedSize, parseInt(e.target.value))}
                      />
                      <p>Price: £{(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</p>
                    </div>
                    <div className="remove-button">
                      <button onClick={() => handleRemoveItem(item.id, item.selectedSize)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <h3>Total: £{calculateTotal()}</h3>
              <button onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
