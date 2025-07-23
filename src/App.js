import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./components/Login/Login";
import CustomerScreen from "./Customer/CustomerScreen";
import Staff from "./Staff/Staff";
import Admin_dashboard from "./Admin/AdminLayout";
import OrderManager from "./Admin/OrderManager";
import AccountManager from "./Admin/AccountManager";
import MenuManager from "./Admin/MenuManager";
import DashBoard from "./Admin/DashBoard";
import PreOrderPage from "./Customer/PreOrderInfor";
import TableManager from "./Admin/TableManager";
import ActiveTables from "./Staff/components/ActiveTables";
import AllTables from "./Staff/components/AllTables";
import Checkout from "./Staff/components/Checkout";
import SalesStatistics from "./Admin/SalesStatistics";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const savedUser = JSON.parse(sessionStorage.getItem("user"));
      if (savedUser) setUser(savedUser);
    };

    checkUser();

    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login setUser={setUser} />}/>
      {user.roleId === 1 && (
        <>
          <Route path="/pre-order" element={<PreOrderPage />} />
          <Route path="/" element={<CustomerScreen setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
      {user.roleId === 2 && (
        <>
          <Route path="/staff" element={<Staff setUser={setUser}/>} >
            <Route index element={<AllTables />} />
            <Route path="all" element={<AllTables />} />
            <Route path="active" element={<ActiveTables />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
          <Route path="*" element={<Navigate to="/staff" />} />
        </>
      )}
      {user.roleId === 3 && (
        <>
          <Route path="/admin" element={<Admin_dashboard setUser={setUser} />}>
            <Route index element={<DashBoard />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="users" element={<AccountManager />} />
            <Route path="tables" element={<TableManager />} />
            <Route path="sales" element={<SalesStatistics />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" />} />
        </>
      )}
    </Routes>
  );

}