import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Shop from './Shop';
import LoginPage from './LoginPage';
import reportWebVitals from './reportWebVitals';
import AboutUs from './AboutUs';
import Contact from './Contact.js'
import Cart from './Cart.js'
import Shipping from './Shipping.js'
import Size from './SizeGuide.js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Checkout from './Checkout.js';
import { BasketProvider } from './BasketContext';
import SuccessPage from './SuccessPage.js';
import CancelPage from './CancelPage.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>            
    <BasketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<Contact />} /> 
          <Route path="/cart" element={<Cart />} /> 
          <Route path="/shipping" element={<Shipping />} /> 
          <Route path="/sizeguide" element={<Size />} /> 
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<SuccessPage />} />
        <Route path="/checkout/cancel" element={<CancelPage />} />
        </Routes>        
      <ToastContainer />
      </Router>            
    </BasketProvider>
  </React.StrictMode>
);

reportWebVitals();
