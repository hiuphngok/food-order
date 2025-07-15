// Staff.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '../components/SideBar/SideBar_Staff';
import Content from './components/AllTables';
import ActiveTables from './components/ActiveTables';
import PreparingOrders from './components/PreparingOrders';
import ReceivedOrders from './components/ReceivedOrders';
import ServedOrders from './components/ServedOrders';
import Header from '../components/Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import AllTables from './components/AllTables';
import { BrowserRouter } from 'react-router-dom';
import Staff_Header from '../components/Header/Staff_Header';


function Staff({ setUser }) {
  return (
      <div style={{ width: '100%', height: '100%'}}>
        <Staff_Header setUser={setUser} />
        <Row style={{ margin: 0 }}>
          <Col xs={2} className="sidebar">
            <SideBar />
          </Col>

          <Col xs={10} className="content">
            <Routes>
              <Route path="/" element={<AllTables />} />
              <Route path="/active-tables" element={<ActiveTables />} />
              <Route path="/preparing" element={<PreparingOrders />} />
              <Route path="/received" element={<ReceivedOrders />} />
              <Route path="/served" element={<ServedOrders />} />
            </Routes>
          </Col>
        </Row>
      </div>

  );
}

export default Staff;
