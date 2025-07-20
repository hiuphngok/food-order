// Staff.js
import React from 'react';
import SideBar from '../components/SideBar/SideBar_Staff';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import Staff_Header from '../components/Header/Staff_Header';
import { Outlet } from 'react-router-dom';



function Staff({ setUser }) {
  return (
      <>
        <Staff_Header setUser={setUser} />
        <Row fluid style={{ paddingTop: '56px' }}>
          <Col lg={2} md={3} className="gx-0">
            <SideBar />
          </Col>

          <Col lg={10} md={9} className="pt-5 px-4 gx-0">
            <Outlet/>
          </Col>
        </Row>
      </>

  );
}

export default Staff;
