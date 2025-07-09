import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import CardFood from './CardFood/CardFood';
import SideBar from './SideBar/SideBar';

function Home({ addToCart }) {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:9999/menu')
      .then(res => setMenuItems(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Row className="gx-0" style={{ paddingTop: '56px' }}>
      <Col lg={2} md={3}><SideBar /></Col>
      <Col lg={10} md={9}>
        <Row className="gx-3 gy-4 px-3">
          {menuItems.map(item => (
            <Col key={item.id} lg={4} md={6}>
              <CardFood
                id={item.id}
                name={item.name}
                price={item.price}
                image="https://img5.thuthuatphanmem.vn/uploads/2021/11/09/anh-do-an-cute-hd_095144068.jpg"
                addToCart={addToCart}
              />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}

export default Home;
