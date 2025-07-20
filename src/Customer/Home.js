import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Spinner, Alert, Container } from 'react-bootstrap';
import CardFood from '../components/CardFood/CardFood';
import SideBar from '../components/SideBar/SideBar';

function Home({ addToCart, searchTerm, setMenu }) { // vừa bổ sung searchTerm
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:9999/menu')
      .then(res => {
        setMenuItems(res.data);
        setMenu(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Lọc các mục thực đơn theo từ khóa tìm kiếm và danh mục đã chọn
  const filteredMenuItems = menuItems.filter(item => {
    const matchSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === null || item.categoryId === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <Row className="gx-0" style={{ paddingTop: '56px', minHeight: '100vh' }}>
      <Col lg={2} md={3}>
        <SideBar onCategorySelect={setSelectedCategory} />
      </Col>
      <Col lg={10} md={9} gap="4">
        <Container fluid className="py-4 px-4">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <Alert variant="warning">No menu items found.</Alert>
          ) : (
            <Row className="gx-4 gy-4">
              {filteredMenuItems.map(item => (
                <Col key={item.id} lg={6} md={6}>
                  <CardFood
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    addToCart={addToCart}
                    serveTime={item.serveTime}
                  />
                </Col>
              ))}
            </Row>

          )}
        </Container>
      </Col>
    </Row>
  );
}

export default Home;
