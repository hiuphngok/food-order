import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Form, Row, Col, Button, Nav, Container } from 'react-bootstrap';
import './index.css'
import { useNavigate } from 'react-router-dom';
import { hover } from '@testing-library/user-event/dist/hover';

function Header() {
  const navigate = useNavigate()

  return (
    <Navbar expand="lg" variant="dark" fixed="top" style={{ backgroundColor: '#0a0a0a' }}>
      <Container fluid>
        <Row className="align-items-center w-100">

          <Col md={3}>
            <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Food Order</Navbar.Brand>
          </Col>

          <Col md={6}>
            <Form className="d-flex">
              <Form.Control
                type="text"
                placeholder="Search"
                className="me-2 custom-input text-white"
                style={{ minWidth: '200px', backgroundColor: '#101012', border: 'none' }}
              />
              <Button type="submit" style={{ backgroundColor: '#101000', border: 'none' }}>
                Search
              </Button>
            </Form>
          </Col>


          <Col md={3} className="d-flex justify-content-end">
            <Nav>
              <Nav.Link href="#login" className="me-3 text-white">
                Login
              </Nav.Link>
              <Nav.Link href="#register" className='text-white'>Register</Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Header;
