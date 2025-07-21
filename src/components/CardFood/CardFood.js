import React from 'react';
import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function CardFood({ id, name, price, image, addToCart, serveTime }) {
  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: '12px', display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '200px' }}>
      <div style={{ flex: '1 1 55%' }}>
        <Card.Img
          src={`/images/${image}`}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <Card.Body style={{ flex: '1 1 45%', padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Card.Title className="mb-1" style={{ fontSize: '1rem', fontWeight: '600' }}>{name}</Card.Title>
          <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>{price.toLocaleString()}₫</Card.Text>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Serve time: {serveTime} minutes</div>
        </div>
        <div className="d-flex justify-content-end">
          <Button style={{ backgroundColor: '#FFA500', border: 'none', color: 'white', padding: '4px 12px', borderRadius: '8px', fontWeight: 'bold' }} size="sm" onClick={() => addToCart({ id, name, price, image, serveTime })}>+</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardFood;