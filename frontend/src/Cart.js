import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import './AboutUs.css';
import { toast } from 'react-toastify';
import { BasketContext } from './BasketContext';
import { getDiscountedPrice } from './discounts';

const Cart = () => {
  const { basket, setBasket } = useContext(BasketContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, selectedSize, newQuantity) => {
    const updatedBasket = basket.map(item => {
      if (item.id === productId && item.selectedSize === selectedSize) {
        const updatedQuantity = Math.max(1, newQuantity);
        const discountedPrice = getDiscountedPrice(item.type, updatedQuantity, item.unitPrice);
        return { ...item, quantity: updatedQuantity, price: discountedPrice };
      }
      return item;
    });

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

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  const calculateItemTotal = (item) => formatPrice(item.price * item.quantity);
  const calculateItemSavings = (item) => formatPrice((item.unitPrice - item.price) * item.quantity);
  const calculateTotal = () => formatPrice(basket.reduce((total, item) => total + (item.price * item.quantity), 0));
  const calculateTotalSavings = () => formatPrice(basket.reduce((total, item) => {
    if (item.quantity > 2) {
      return total + ((item.unitPrice - item.price) * item.quantity);
    }
    return total;
  }, 0));

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };


  return (
    <div className="cart-page">
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
          onClick={() => navigate('/cart')}
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
          onClick={() => window.open('https://www.instagram.com/hourszer0/', '_blank')}
        />
        <img 
          src="./assets/img/icons8-tiktok-24.png" 
          alt="Our TikTok" 
          className="icon" 
          onClick={() => window.open('https://www.tiktok.com/@hourszero', '_blank')}
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
        </div>
        <div className="price-details">
          {item.quantity >= 3 ? (
            <>
              {/* <p>Original price: <span className="original-price">£{formatPrice(item.unitPrice)}</span></p> */}
              {/* <p>Discounted price: <strong>£{formatPrice(item.price)}</strong></p> */}
              <p>Total for this item: <strong>£{formatPrice(item.price * item.quantity)}</strong></p>
              <p className="savings">You save: £{formatPrice((item.unitPrice - item.price) * item.quantity)}</p>
            </>
          ) : (
            <>
              <p>Price: <strong>£{formatPrice(item.unitPrice)}</strong></p>
              <p>Total for this item: <strong>£{formatPrice(item.unitPrice * item.quantity)}</strong></p>
            </>
          )}
        </div>
        <button onClick={() => handleRemoveItem(item.id, item.selectedSize)} className="remove-button">Remove</button>
      </div>
    </li>
  ))}
            </ul>
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <p>Subtotal: £{calculateTotal()}</p>
              <p className="total-savings">Total Savings: £{calculateTotalSavings()}</p>
              <h3>Total: £{calculateTotal()}</h3>
              <button onClick={handleCheckout} className="checkout-button">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;