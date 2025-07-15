import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import CustomerScreen from './Customer/CustomerScreen';
// import Admin_dashboard from './Admin/Admin_dashboard';
import PreOrderPage from './Customer/PreOrderInfor';
import './index.css'
import Admin_dashboard from './Admin/AdminLayout';
import App from './App';
import Staff from './Staff/Staff';
import TestRouter from './TestRouter';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>

  </React.StrictMode>
);
