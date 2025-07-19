import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Modal, Form, Alert } from 'react-bootstrap';
import { Clock, Edit, Trash2, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header/Header';

const PreOrderPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [menu, setMenu] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const tableId = user?.tableId;


  useEffect(() => {
    axios.get('http://localhost:9999/menu')
      .then(res => setMenu(res.data));

    axios.get(`http://localhost:9999/orders?tableId=${tableId}`)
      .then(res => {
        const allOrders = res.data;
        const allItems = allOrders.flatMap(order => order.items);
        const mergedItems = mergeDuplicateItems(allItems);
        setOrderItems(mergedItems);
      });
  }, []);

  const mergeDuplicateItems = (items) => {
    const merged = [];
    for (const item of items) {
      const existing = merged.find(i => i.menuId === item.menuId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.remainingMinutes = Math.max(existing.remainingMinutes, item.remainingMinutes);
      } else {
        merged.push({ ...item });
      }
    }
    return merged;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ordered':
        return <Badge bg="primary" className="d-flex align-items-center gap-1"><ShoppingCart size={12} /> Ordered</Badge>;
      case 'preparing':
        return <Badge bg="warning" className="d-flex align-items-center gap-1"><Clock size={12} /> Preparing</Badge>;
      case 'received':
        return <Badge bg="success" className="d-flex align-items-center gap-1"><CheckCircle size={12} /> Received</Badge>;
      case 'served':
        return <Badge bg="primary" className="d-flex align-items-center gap-1"><CheckCircle size={12} /> Served</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getItemName = (menuId) => {
    const item = menu.find(m => m.id == menuId);
    return item ? item.name : 'Unknown';
  };

  const getItemPrice = (menuId) => {
    const item = menu.find(m => m.id == menuId);
    return item ? item.price : 0;
  };

  const canEdit = (status) => status === 'ordered';

  const handleEdit = (item) => {
    setEditItem(item);
    setNewQuantity(item.quantity);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedItems = orderItems.map(item =>
      item.menuId === editItem.menuId ? { ...item, quantity: newQuantity } : item
    );
    setOrderItems(updatedItems);
    setShowEditModal(false);
    setAlertMessage('Item quantity updated (local only).');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDelete = (menuId) => {
    const updatedItems = orderItems.filter(item => item.menuId !== menuId);
    setOrderItems(updatedItems);
    setAlertMessage('Item removed (local only).');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + getItemPrice(item.menuId) * item.quantity, 0);
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  // Handle checkout action, post staffCalls to database
  const handleCheckout = () => {
    const requestData = {
      tableId: tableId,
      time: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }),
      status: 'pending'
    };

    axios.post('http://localhost:9999/staffCalls', requestData)
      .then(() => {
        setAlertMessage('Thank you! A staff member is on the way with the QR code for payment.');
        setShowAlert(true);
      })
      .catch(err => {
        console.error('Checkout failed:', err);
        setAlertMessage('Failed to checkout. Please try again.');
        setShowAlert(true);
      });
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Row><Header /></Row>
      <Row className='p-5'>
        <Col md={12} className="p-4">
          <h2 className="mb-4">Pre-Order Information</h2>
          {showAlert && <Alert variant="success" className="mb-4">{alertMessage}</Alert>}

          <Card className="shadow-sm">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <ShoppingCart size={20} /> Your Order - Table {tableId}
              </h5>
            </Card.Header>
            <Card.Body>
              {orderItems.length === 0 ? (
                <div className="text-center py-5">
                  <AlertCircle size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No items in your order</h5>
                  <p className="text-muted">Go back to menu to add items</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {orderItems.map((item, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center py-3 gap-3">
                      <img
                        src={`/images/${menu.find(m => m.id == item.menuId)?.image || 'default.jpg'}`}
                        alt={getItemName(item.menuId)}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}
                      />

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1">{getItemName(item.menuId)}</h6>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="text-muted">Quantity: </span>
                            <strong>{item.quantity}</strong>
                            <span className="text-muted ms-3">Price: </span>
                            <strong>{formatPrice(getItemPrice(item.menuId))}</strong>
                          </div>
                          <div>
                            <span className="text-muted">Total: </span>
                            <strong className="text-primary">
                              {formatPrice(getItemPrice(item.menuId) * item.quantity)}
                            </strong>
                          </div>
                        </div>
                        {item.status === 'preparing' && (
                          <div className="mt-2">
                            <small className="text-warning">
                              <Clock size={12} className="me-1" />
                              Estimated time: {item.remainingMinutes} minutes
                            </small>
                          </div>
                        )}
                      </div>
                      <div className="ms-3">
                        {canEdit(item.status) && (
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(item)}><Edit size={14} /></Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.menuId)}><Trash2 size={14} /></Button>
                          </div>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
            {orderItems.length > 0 && (
              <Card.Footer className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">
                      Total Amount: <span className="text-primary">{formatPrice(calculateTotal())}</span>
                    </h5>
                  </div>
                  <Button variant="success" size="lg" onClick={handleCheckout} className="px-4">
                    <ShoppingCart size={16} className="me-2" /> Checkout
                  </Button>
                </div>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Item Quantity</Modal.Title></Modal.Header>
        <Modal.Body>
          {editItem && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Item: {getItemName(editItem.menuId)}</Form.Label>
                <Form.Label className="d-block text-muted">Price: {formatPrice(getItemPrice(editItem.menuId))}</Form.Label>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(parseInt(e.target.value))}
                />
              </Form.Group>
              <div className="alert alert-info">
                <strong>New total: {formatPrice(getItemPrice(editItem.menuId) * newQuantity)}</strong>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PreOrderPage;
