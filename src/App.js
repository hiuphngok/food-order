import Header from "./components/Header/Header.jsx";
import CardFood from "./components/CardFood/CardFood.jsx";
import SideBar from "./components/SideBar/SideBar.jsx";
import TotalAmount from "./components/TotalAmount/TotalAmount.jsx";
import { Row, Col } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

function App() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Header />

      <Row className="gx-0" style={{ paddingTop: '56px' }}>
        <Col lg={2} md={3}>
          <SideBar />
        </Col>
        <Col lg={10} md={9}>
          <Row className="gx-3 gy-4 px-3">
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
            <Col lg={4} md={6}>
              <CardFood />
            </Col>
          </Row>
        </Col>
      </Row>

      <TotalAmount />
    </div>
  );
}

export default App;
