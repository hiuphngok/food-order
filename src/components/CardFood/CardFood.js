import React from 'react';
import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function CardFood() {
  return (
    <Card
      style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'row',
        color: 'black',
        border: '0.125px solid #ddd',
        borderRadius: '1px',
        margin: '10px'
      }}
    >
      <Card.Img
        src="https://daubepgiadinh.vn/wp-content/uploads/2018/03/canh-rong-bien.jpg"
        style={{
          width: '55%',
          height: '100%',
          objectFit: 'fill',
        }}
      />
      <Card.Body
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Card.Title style={{ fontSize: '1.1rem', fontWeight: '600' }}>
            Canh Rong Biển
          </Card.Title>
          <Card.Text style={{ fontSize: '0.9rem', opacity: 0.85 }}>
            20$
          </Card.Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="warning" size="sm" style={{ fontWeight: 'bold' }}>
            +
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardFood;
