import { Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

export default function Admin_SideBar() {
  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        height: '100vh',
        paddingTop: '56px',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '16.6666%'
      }}
    >
      <h4 className="p-3">Admin DashBoard</h4>
      <Nav className="flex-column px-3">
        <Nav.Link as={NavLink} to="/admin/menu" className="text-white">Quản lý Menu</Nav.Link>
        <Nav.Link as={NavLink} to="/admin/users" className="text-white">Quản lý Tài khoản</Nav.Link>
        <Nav.Link as={NavLink} to="/admin/orders" className="text-white">Xem Đơn hàng</Nav.Link>
      </Nav>
    </div>
  );
}
