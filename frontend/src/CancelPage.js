import React from 'react';
import { Link } from 'react-router-dom';
import './CheckoutResult.css';

const CancelPage = () => {
  return (
    <div className="checkout-result cancel">
      <h1>Order Canceled</h1>
      <p>Your order has been canceled and no payment has been processed.</p>
      <p>If you changed your mind or encountered any issues, please feel free to try again.</p>
      <div className="order-actions">
        <Link to="/cart" className="btn btn-primary">Return to Cart</Link>
        <Link to="/shop" className="btn btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default CancelPage;