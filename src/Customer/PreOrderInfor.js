import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Modal, Form, Alert } from 'react-bootstrap';
import { Clock, Edit, Trash2, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header/Header';

const PreOrderPage = () => {
  // Sample data từ database
  const menuItems = {
    103: { name: "Sliced Beef", price: 99000 },
    111: { name: "Green Tea", price: 12000 }
  };

  const [orderItems, setOrderItems] = useState([
    {
      menuId: 103,
      quantity: 2,
      status: "preparing",
      remainingMinutes: 3
    },
    {
      menuId: 111,
      quantity: 1,
      status: "received",
      remainingMinutes: 5
    }
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'preparing':
        return <Badge bg="warning" className="d-flex align-items-center gap-1">
          <Clock size={12} />
          Preparing
        </Badge>;
      case 'received':
        return <Badge bg="success" className="d-flex align-items-center gap-1">
          <CheckCircle size={12} />
          Received
        </Badge>;
      case 'served':
        return <Badge bg="primary" className="d-flex align-items-center gap-1">
          <CheckCircle size={12} />
          Served
        </Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const canEdit = (status) => {
    return status === 'ordered';
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewQuantity(item.quantity);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setOrderItems(prev =>
      prev.map(item =>
        item.menuId === editItem.menuId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    setShowEditModal(false);
    setAlertMessage('Item quantity updated successfully!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDelete = (menuId) => {
    setOrderItems(prev => prev.filter(item => item.menuId !== menuId));
    setAlertMessage('Item removed from order!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (menuItems[item.menuId].price * item.quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleCheckout = () => {
    setAlertMessage('Thank you! A staff member is on the way with the QR code for payment.');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Row>
        <Header />
      </Row>
      <Row className='p-5'>
        <Col md={12} className="p-4">
          <h2 className="mb-4">Pre-Order Information</h2>
          {showAlert && (
            <Alert variant="success" className="mb-4">
              {alertMessage}
            </Alert>
          )}
          <Card className="shadow-sm">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <ShoppingCart size={20} />
                Your Order - Table 2
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
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center py-3">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1">{menuItems[item.menuId].name}</h6>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="text-muted">Quantity: </span>
                            <strong>{item.quantity}</strong>
                            <span className="text-muted ms-3">Price: </span>
                            <strong>{formatPrice(menuItems[item.menuId].price)}</strong>
                          </div>
                          <div>
                            <span className="text-muted">Total: </span>
                            <strong className="text-primary">
                              {formatPrice(menuItems[item.menuId].price * item.quantity)}
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
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(item.menuId)}
                            >
                              <Trash2 size={14} />
                            </Button>
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
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleCheckout}
                    className="px-4"
                  >
                    <ShoppingCart size={16} className="me-2" />
                    Checkout
                  </Button>
                </div>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editItem && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Item: {menuItems[editItem.menuId].name}</Form.Label>
                <Form.Label className="d-block text-muted">
                  Price: {formatPrice(menuItems[editItem.menuId].price)}
                </Form.Label>
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
                <strong>New total: {formatPrice(menuItems[editItem.menuId].price * newQuantity)}</strong>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PreOrderPage;