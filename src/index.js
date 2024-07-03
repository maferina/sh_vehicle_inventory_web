import React from 'react';
import { createRoot } from 'react-dom/client'; 
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = "https://vehicleinvapi.eastus2.azurecontainer.io:8080/";


axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
})

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);