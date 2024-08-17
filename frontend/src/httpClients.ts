import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000',  // Update this to match your Flask server's address
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default instance;