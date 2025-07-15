import React from 'react';
import ReactDOM from 'react-dom/client';
import CustomerScreen from './Customer/CustomerScreen';
// import Admin_dashboard from './Admin/Admin_dashboard';
import PreOrderPage from './Customer/PreOrderInfor';
import './index.css'
import Staff from './Staff/Staff';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Bỏ comment đoạn này để chạy CustomerScreen <CustomerScreen /> */}
    {/* Bỏ comment đoạn này để chạy AdminDashboard <Admin_dashboard /> */}
    {/*Bỏ comment đoạn này để chạy PreOrderPage <PreOrderPage />*/}
    <Staff />
  </React.StrictMode>
);
