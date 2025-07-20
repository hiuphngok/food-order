import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';

function CartModal({ show, onClose, cart, changeQuantity, removeItem, total, showToast }) {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9999/menu")
      .then(res => setMenuData(res.data))
      .catch(err => console.error("Failed to load menu:", err));
  }, []);

  const getServeTime = (menuId) => {
    const item = menuData.find(m => m.id === menuId);
    return item?.serveTime || 2;
  };

  const handleSubmitOrder = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty. Please add some items before ordering.");
      return;
    }
    const invalidItems = cart.filter(item => {
      const menuItem = menuData.find(m => m.id == item.id);
      return item.quantity > menuItem.stock;
    });

    if (invalidItems.length > 0) {
      const message = invalidItems.map(e =>
        `"${e.name}" (only ${menuData.find(m => m.id == e.id)?.stock} left)`
      ).join('\n');
      showToast(`Some items exceed available stock:\n${message}`);
      return;
    }

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
        showToast("Order submitted successfully!");
        onClose();
      })
      .catch(err => {
        console.error(err);
        showToast("Failed to submit order. Please try again.");
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
              <ListGroup.Item key={item.id} className="d-flex gap-3 align-items-center justify-content-between">
                <img
                  src={`/images/${item.image}`}
                  alt={item.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    flexShrink: 0
                  }}
                />
                <div className="flex-grow-1">
                  <strong>{item.name}</strong>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {item.price.toLocaleString()}₫ x {item.quantity} &nbsp; | &nbsp;
                    <span className="text-primary fw-bold">
                      {(item.price * item.quantity).toLocaleString()}₫
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Button size="sm" variant="outline-secondary" onClick={() => changeQuantity(item.id, -1)}>-</Button>
                  <div
                    style={{
                      padding: '3.5px 0px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      minWidth: '32px',
                      textAlign: 'center'
                    }}
                  >
                    {item.quantity}
                  </div>
                  <Button size="sm" variant="outline-secondary" onClick={() => changeQuantity(item.id, 1)}>+</Button>
                  <Button size="sm" variant="outline-danger" style={{ marginLeft: '8px' }} onClick={() => removeItem(item.id)}>Remove</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <strong>Total: {total.toLocaleString()}₫</strong>
        <Button variant="success" onClick={handleSubmitOrder}>Submit Order</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CartModal;
