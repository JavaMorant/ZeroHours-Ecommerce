import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { BasketContext } from './BasketContext';
import { loadStripe } from '@stripe/stripe-js';
import "./Checkout.css";

// Make sure to replace with your actual publishable key
const stripePromise = loadStripe('pk_test_51PpWYO2Lpl1R0iboJQ53cfJkTYtZD5ed7IpAdHvVghxBQcvh2UjwtQE0AksqPTKKjLPMJ0GryqTZH3CVjSKAorKh00AMEf0Py3');

const ProductDisplay = ({ basket, total, onCheckout }) => (
  <section className="product-display">
    <h2>Your Order Summary</h2>
    {basket.map((item, index) => (
      <div key={index} className="product">
        <img src={item.photo} alt={item.name} />
        <div className="description">
          <h3>{item.name}</h3>
          <p>Size: {item.selectedSize}</p>
          <p>Quantity: {item.quantity}</p>
          <h5>£{(item.price * item.quantity).toFixed(2)}</h5>
        </div>
      </div>
    ))}
    <div className="total">
      <h3>Total: £{total.toFixed(2)}</h3>
    </div>
    <button onClick="onCheckout">
      Proceed to Payment
    </button>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function Checkout() {
  const [message, setMessage] = useState("");
  const { basket, setBasket } = useContext(BasketContext);
  const navigate = useNavigate();

  const total = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
      setBasket([]); // Clear the basket after successful order
      setTimeout(() => navigate('/'), 3000); // Redirect to home after 3 seconds
    }
    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
      setTimeout(() => navigate('/shop'), 3000); // Redirect to shop after 3 seconds
    }
  }, [setBasket, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: basket.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    });

    const { id } = await response.json();

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: id,
    });

    if (error) {
      console.log(error);
      setMessage("An error occurred. Please try again.");
    }
  };

  if (basket.length === 0 && !message) {
    navigate('/shop');
    return null;
  }

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay basket={basket} total={total} onCheckout={handleSubmit} />
  );
}