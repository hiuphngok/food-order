import { Container, Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import Content from "./components/Content";
import Banner from "./components/Banner";
import Header from "./components/Header";
function App() {

  const [filter, setFilter] = useState(null);

  return (
    <Container fluid className="p-0">
      <Header />
      <style type="text/css">
        {`
        .content {
          padding: 20px;
            }
        .banner {
          background - color: #343a40;
        color: white;
        padding: 20px;
        text-align: center;
            }
       
          `}
      </style>
      <Row>
        <Col xs={3} className="sidebar">
          <Banner onFilterChange={setFilter} />
        </Col>
        <Col xs={9} className="content">
          <Content filter={filter}/>
        </Col>
      </Row>

    </Container>
  );
}
export default App;