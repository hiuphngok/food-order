import { Routes, Route, Navigate } from 'react-router-dom';
import MenuManager from './MenuManager'     
import OrderManager from './OrderManager';    
import AccountManager from './AccountManager';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/menu" element={<MenuManager />} />
      <Route path="/admin/orders" element={<OrderManager />} />
      <Route path="/admin/users" element={<AccountManager />} />
      <Route path="/admin" element={<Navigate to="/admin/menu" />} />
    </Routes>
  );
}
