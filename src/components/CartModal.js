import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useState, useEffect } from 'react';

function CartModal({ show, onClose, cart, changeQuantity, removeItem, total }) {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9999/menu")
      .then(res => setMenuData(res.data))
      .catch(err => console.error("Loading failed:", err));
  }, []);

  const getServeTime = (menuId) => {
    const item = menuData.find(m => m.id === menuId);
    return item?.serveTime || 2; // fallback nếu không có
  };

  const handleSubmitOrder = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const tableId = user?.tableId;


    const itemsWithServeTime = cart.map(item => ({
      menuId: item.id,
      quantity: item.quantity,
      status: 'ordered',
      remainingMinutes: getServeTime(item.id)
    }));

    const newOrder = {
      tableId,
      items: itemsWithServeTime,
      status: 'ordered',
      orderTime: new Date().toISOString(),
      expectedServeTime: new Date(Date.now() + 15 * 60000).toISOString()
    };

    axios.post("http://localhost:9999/orders", newOrder)
      .then(() => {
        alert("Order submitted successfully!");
        onClose();
      })
      .catch(err => {
        console.error(err);
        alert("Failed to submit order. Please try again.");
      });
  };


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
        <Button variant="success" onClick={handleSubmitOrder}>
          Submit Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CartModal;
