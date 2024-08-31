import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import httpClient from './httpClients.ts';
import './AccountSettings.css';

const AccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    name: '',
    address: '',
  });
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');

  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchUserInfo();
      fetchOrderHistory();
    }
  }, [isLoggedIn, navigate]);

  const fetchUserInfo = async () => {
    try {
      const response = await httpClient.get(`${apiUrl}/user-info`);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await httpClient.get(`${apiUrl}/order-history`);
      setOrderHistory(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await httpClient.put(`${apiUrl}/update-profile`, userInfo);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      await httpClient.put(`${apiUrl}update-password`, { password: newPassword });
      setMessage('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage('Error updating password');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={`account-settings ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Account Settings</h1>
      <div className="settings-container">
        <div className="settings-nav">
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
          <button onClick={() => setActiveTab('password')} className={activeTab === 'password' ? 'active' : ''}>Password</button>
          <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>Order History</button>
        </div>
        
        <div className="settings-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate}>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
                placeholder="Address"
              />
              <button type="submit">Update Profile</button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordUpdate}>
              <input
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm New Password"
                required
              />
              <button type="submit">Update Password</button>
            </form>
          )}

          {activeTab === 'orders' && (
            <div className="order-history">
              <h2>Order History</h2>
              {orderHistory.map((order) => (
                <div key={order.id} className="order-item">
                  <p>Order ID: {order.id}</p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p>Total: ${order.total.toFixed(2)}</p>
                  <p>Status: {order.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {message && <p className="message">{message}</p>}

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default AccountSettings;