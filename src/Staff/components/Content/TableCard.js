import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';

function TableCard({ table, onClick }) {
  return (
    <Card style={{ width: '100%', maxWidth: '400px', margin: '10px', display: 'flex', flexDirection: 'row' }} onClick={() => onClick(table)} className="table-card d-flex align-items-center">
      <Card.Img variant="top" src={table.image} alt={table.id} style={{ width: '55%', height: '100%', objectFit: 'fill' }}/>
      <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Card.Title className='table-card-title'>Bàn {table.id}</Card.Title>
        <Card.Text>
            Trạng thái: {table.status === 'called_all' ? 'Đã gọi món' : table.status === 'called_some' ? 'Một số món đã gọi' : 'Chưa gọi món'}
        </Card.Text>
        <ul>
          {table.orders.map((order, index) => (
            <li key={index}>
              <img src={order.img} alt={order.name} style={{ width: '30px', height: '30px' }} />
                {order.name} - Trạng thái: {order.status === 'done' ? 'Hoàn thành' : order.status === 'cooking' ? 'Đang nấu' : 'Chưa gọi'}
            </li>
            ))}
        </ul>
      </Card.Body>
    </Card>
  );
}

export default TableCard;