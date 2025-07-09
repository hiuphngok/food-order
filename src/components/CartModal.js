import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

function CartModal({ show, onClose, cart, changeQuantity, removeItem, total }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ListGroup>
            {cart.map(item => (
              <ListGroup.Item key={item.id}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.name}</strong> <br />
                    <small>{item.price.toLocaleString()}₫ x {item.quantity}</small>
                  </div>
                  <div>
                    <Button size="sm" variant="light" onClick={() => changeQuantity(item.id, -1)}>-</Button>
                    <Button size="sm" variant="light" onClick={() => changeQuantity(item.id, 1)}>+</Button>
                    <Button size="sm" variant="danger" onClick={() => removeItem(item.id)}>x</Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <strong>Total: {total.toLocaleString()}₫</strong>
        <Button variant="success" onClick={() => alert('Phần checkout t chưa làm nhé')}>
          Checkout
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CartModal;
