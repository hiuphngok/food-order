import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container } from "react-bootstrap";
import React, { useState } from "react";
import Content from "./components/Content/Content";
import Header from '../components/Header/Header';
import SideBar from '../components/SideBar/SideBar_Staff';

function Staff() {

  return (
    <div style={{ width: '100%', height: '100%' }}>
    <Header />

 
      <Row>
        <Col xs={2} className="sidebar">
          <SideBar/>
        </Col>
        <Col xs={10} className="content">
          <Content/>
        </Col>
      </Row>
    
  </div>
  );
}

export default Staff;