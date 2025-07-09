import React from 'react';
import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function CardFood({ id, name, price, image, addToCart }) {
  return (
    <Card style={{ width: '100%', maxWidth: '400px', margin: '10px', display: 'flex', flexDirection: 'row' }}>
      <Card.Img src={image} style={{ width: '55%', height: '100%', objectFit: 'fill' }} />
      <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{price.toLocaleString()}₫</Card.Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="warning" size="sm" onClick={() => addToCart({ id, name, price })}>+</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardFood;
