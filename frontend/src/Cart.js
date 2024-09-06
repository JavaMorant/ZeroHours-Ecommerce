import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import './AboutUs.css';
import { toast } from 'react-toastify';
import { BasketContext } from './BasketContext';

const Cart = () => {
  const { basket, setBasket } = useContext(BasketContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const calculatePrice = (productId, quantity) => {
    if (productId === 2) {
      switch (quantity) {
        case 1: return 9.99;
        case 2: return 17.99;
        case 3: return 23.99;
        case 4: return 31.99;
        default: return 31.99 + (quantity - 4) * 7.99; // For quantities > 4
      }
    }
    return 9.99 * quantity; // Default pricing for other products
  };

  const handleQuantityChange = (productId, selectedSize, newQuantity) => {
    const updatedBasket = basket.map(item =>
      item.id === productId && item.selectedSize === selectedSize
        ? { ...item, quantity: Math.max(1, newQuantity), price: calculatePrice(productId, Math.max(1, newQuantity)) }
        : item
    );
    setBasket(updatedBasket);
    toast.info('Quantity updated');
  };

  const handleRemoveItem = (productId, selectedSize) => {
    const updatedBasket = basket.filter(item => 
      !(item.id === productId && item.selectedSize === selectedSize)
    );
    setBasket(updatedBasket);
    toast.info('Item removed from basket');
  };

  const calculateTotal = () => {
    return basket.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div>
      {/* Desktop Navigation */}
      <nav id="desktop-nav">
        <div>
          <ul className="nav-links">
            <li><Link to="/shop">SHOP</Link></li>
            <li><Link to="/about">OUR MESSAGE</Link></li>
            <li><Link to="/sizeguide">SIZE GUIDE</Link></li>
            <li><Link to="/shipping">SHIPPING</Link></li>
            <li><Link to="/contact">CONTACT US</Link></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
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
                <li><Link to="/shop" onClick={toggleMenu}>Shop</Link></li>
                <li><Link to="/about" onClick={toggleMenu}>Our Message</Link></li>
                <li><Link to="/sizeguide" onClick={toggleMenu}>Size Guide</Link></li>
                <li><Link to="/shipping" onClick={toggleMenu}>Shipping</Link></li>
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
          <img src="./assets/img/logo_nobg.png" alt="Our Logo" className="logo" />
        </Link>
      </div>
      
      {/* Social Media Icons */}
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

      {/* Cart Contents */}
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
                      <p>Price: £{item.price.toFixed(2)}</p>
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