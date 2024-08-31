import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BasketContext } from './BasketContext';
import './CheckoutResult.css';

const SuccessPage = () => {
  const { setBasket } = useContext(BasketContext);

  useEffect(() => {
    // Clear the basket after successful payment
    setBasket([]);
  }, [setBasket]);

  return (
    <div className="checkout-result success">
      <h1>Thank You for Your Order!</h1>
      <p>Your payment was successful and your order is being processed.</p>
      <p>You will receive an email confirmation shortly.</p>
      <div className="order-actions">
        <Link to="/" className="btn btn-primary">Return to Home</Link>
        <Link to="/shop" className="btn btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default SuccessPage;