import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import Content from "./components/Content/Content";

import Header from "./components/Header/Header";
import SideBar from './components/SideBar/SideBar_Staff';
function Staff() {

  const [filter, setFilter] = useState(null);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Header />

      <Row>
        <Col xs={3} className="sidebar">
           <SideBar/>
        </Col>        
        <Col xs={9} className="content">
          <Content filter={filter}/>
        </Col>
      </Row>

    </div>
  );
}

export default Staff;