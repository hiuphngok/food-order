import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Admin_dashboard from './Admin/Admin_dashboard';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Bỏ comment đoạn này để chạy CustomerScreen */}
    {/* <App /> */} 
    {/* Bỏ comment đoạn này để chạy AdminDashboard */}
    <Admin_dashboard /> 
  </React.StrictMode>
);
