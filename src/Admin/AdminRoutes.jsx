import { Routes, Route, Navigate } from 'react-router-dom';
import MenuManager from './MenuManager'     
import OrderManager from './OrderManager';    
import AccountManager from './AccountManager';
import DashBoard from './DashBoard';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route path="menu" element={<MenuManager />} />
      <Route path="orders" element={<OrderManager />} />
      <Route path="users" element={<AccountManager />} />
    </Routes>
  );
}
