import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import Content from "./components/Content";
import Banner from "./components/Banner";
import Header from "./components/Header";
function App() {

  const [filter, setFilter] = useState(null);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Header />

      <Row>
        <Col xs={3} className="sidebar">
          <Banner onFilterChange={setFilter} />
        </Col>
        
        <Col xs={9} className="content">
          <Content filter={filter}/>
        </Col>
      </Row>

    </div>
  );
}

export default App;