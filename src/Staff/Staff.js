// Staff.js
import React from 'react';
import SideBar from '../components/SideBar/SideBar_Staff';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import Staff_Header from '../components/Header/Staff_Header';
import { Outlet } from 'react-router-dom';



function Staff({ setUser }) {
  return (
      <div style={{ width: '100%', height: '100%'}}>
        <Staff_Header setUser={setUser} />
        <Row style={{ margin: 0 }}>
          <Col xs={2} className="sidebar">
            <SideBar />
          </Col>

          <Col xs={10} className="content">
            <Outlet/>
          </Col>
        </Row>
      </div>

  );
}

export default Staff;
