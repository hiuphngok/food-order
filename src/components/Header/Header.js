import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Form, Row, Col, Button, Nav, Container } from 'react-bootstrap';
import './index.css'
import { useNavigate } from 'react-router-dom';

function Header({ setUser, setSearchTerm, hideSearch }) {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Navbar expand="lg" variant="dark" fixed="top" style={{ backgroundColor: '#0a0a0a' }}>
      <Container fluid>
        <Row className="align-items-center w-100">

          <Col md={3}>
            <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Food Order</Navbar.Brand>
          </Col>



          {user?.roleId === 1 && (
            <Col md={6}>
              {!hideSearch && (
                <Form className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className="me-2 text-white custom-input"
                    style={{ minWidth: '200px', backgroundColor: '#101012', border: 'none' }}
                    onChange={handleSearchChange}
                  />
                </Form>
              )}
            </Col>
          )}


          <Col md={user?.roleId === 1 ? 3 : 9} className="d-flex justify-content-end">
            <Nav>
              {user ? (
                <>
                  <Nav.Link className="text-white me-3" disabled>
                    Hello, {user.username}
                  </Nav.Link>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link onClick={() => navigate("/login")} className="text-white me-3">
                    Login
                  </Nav.Link>
                  <Nav.Link className="text-white">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Header;
