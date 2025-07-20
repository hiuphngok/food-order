import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Admin_SideBar.css";

export default function Admin_SideBar() {
  return (
    <div className="admin-sidebar">
      <h4 className="p-3">Admin DashBoard</h4>
      <Nav className="flex-column px-3">
        <Nav.Link
          as={NavLink}
          to="menu"
          className="sidebar-link"
        >
          Menu Manager
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="users"
          className="sidebar-link"
        >
          Account Manager
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="orders"
          className="sidebar-link"
        >
          Orders
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="tables"
          className="sidebar-link"
        >
          Tables Manager
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="sales"
          className="sidebar-link"
        >
          Sales Statistics
        </Nav.Link>
      </Nav>
    </div>
  );
}
