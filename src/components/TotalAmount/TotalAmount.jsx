import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css';

function TotalAmount() {
  return (
    <Container style={{
      position: 'fixed',
      bottom: '0px',
      right: '0px',
      zIndex: '9999',
      width: '300px'
    }} >
      <Row>
        <Col xs={7} style={{ backgroundColor: 'gray', color: 'white' }}>
          <i className="bi bi-cart"></i>
          <h4>20$</h4>
        </Col>
        <Col xs={5} style={{ backgroundColor: 'orange', color: 'white', textAlign: 'center' }}>
          Shopping Cart
        </Col>

      </Row>

    </Container>
  )
}

export default TotalAmount
