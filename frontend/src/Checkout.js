import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Checkout.css';
import { toast } from 'react-toastify';

const stripePromise = loadStripe('pk_test_51PpWYO2Lpl1R0iboJQ53cfJkTYtZD5ed7IpAdHvVghxBQcvh2UjwtQE0AksqPTKKjLPMJ0GryqTZH3CVjSKAorKh00AMEf0Py3');

const CheckoutForm = ({ amount }) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const cardElementOptions = {
    style: {
      base: {
        color: '#ffffff',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#ff6b6b',
        iconColor: '#ff6b6b'
      }
    }
  };

  const handleChange = async (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const { error } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(`Payment failed: ${error.message}`);
      setProcessing(false);
      return;
    }
    else {
        toast.success('Payment successful! Your order is confirmed.');
        // Clear the cart from local storage after successful payment
    }

    // Here you would typically send the paymentMethod.id to your server
    // and create a PaymentIntent. For this example, we'll just simulate success.
    
    setError(null);
    setSucceeded(true);
    setProcessing(false);
    // Clear the cart from local storage after successful payment
    localStorage.removeItem('basket');
    
    // Redirect to order confirmation page
    navigate('/order-confirmation');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="stripe-element-container">
        <CardElement options={cardElementOptions} onChange={handleChange} />
      </div>
      <button disabled={processing || disabled || succeeded}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <div className="card-error" role="alert">{error}</div>}
      {succeeded && <div className="payment-success">Payment succeeded!</div>}
    </form>
  );
};

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('basket');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      // If cart is empty, redirect to shop page
      navigate('/shop');
    }
  }, [navigate]);

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    setTotal(newTotal);
  }, [cart]);

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <div className="cart-summary">
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <span>{item.quantity} x ${parseFloat(item.price).toFixed(2)}</span>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
        </div>
        <div className="payment-form">
          <h2>Payment Information</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm amount={Math.round(total * 100)} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;