import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Modal, Form, Alert } from 'react-bootstrap';
import { Clock, Edit, Trash2, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header/Header';

const PreOrderPage = ({ setUser }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [menu, setMenu] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const tableId = user?.tableId;

  // Hàm làm mới dữ liệu
  const fetchOrders = () => {
    axios.get(`http://localhost:9999/orders?tableId=${tableId}&status=ordered`)
      .then(res => {
        const allOrders = res.data;
        const allItems = allOrders.flatMap(order => order.items.map(item => ({
          ...item,
          orderId: order.id // Lưu orderId để phân biệt
        })));
        const mergedItems = mergeDuplicateItems(allItems);
        setOrderItems(mergedItems);
      })
      .catch(err => {
        console.error('Lỗi lấy đơn hàng:', err);
        setAlertMessage('Không thể tải đơn hàng.');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  useEffect(() => {
    axios.get('http://localhost:9999/menu')
      .then(res => setMenu(res.data))
      .catch(err => console.error('Lỗi lấy menu:', err));

    fetchOrders(); // Lấy dữ liệu khi mount
  }, [tableId]);

  // Lắng nghe sự kiện focus để làm mới dữ liệu khi quay lại trang
  useEffect(() => {
    const handleFocus = () => fetchOrders();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [tableId]);

  const mergeDuplicateItems = (items) => {
    const merged = [];

    for (const item of items) {
      const existing = merged.find(i => i.menuId === item.menuId && i.status === item.status);
      if (existing) {
        existing.quantity += item.quantity;
        existing.remainingMinutes = Math.max(existing.remainingMinutes, item.remainingMinutes);
        existing.sourceItems.push({ orderId: item.orderId, quantity: item.quantity });
      } else {
        merged.push({
          ...item,
          sourceItems: [{ orderId: item.orderId, quantity: item.quantity }]
        });
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

  const getItemStock = (menuId) => {
    const item = menu.find(m => m.id == menuId);
    return item ? item.stock : 0;
  };

  const canEdit = (status) => status === 'ordered';

  const handleEdit = (item) => {
    setEditItem(item);
    setNewQuantity(item.quantity);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!canEdit(editItem.status)) {
      setAlertMessage('Only items in "ordered" status can be edited.');
      setShowAlert(true);
      setShowEditModal(false);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (newQuantity <= 0) {
      setAlertMessage('Quantity must be greater than 0.');
      setShowAlert(true);
      setShowEditModal(false);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const stock = getItemStock(editItem.menuId);
    if (newQuantity > stock) {
      setAlertMessage(`"${getItemName(editItem.menuId)}" only has ${stock} left in stock.`);
      setShowAlert(true);
      setShowEditModal(false);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const originalItems = [...orderItems]; // lưu trạng thái ban đầu để rollback

    const totalOld = editItem.sourceItems.reduce((sum, si) => sum + si.quantity, 0);
    const updatedSource = editItem.sourceItems.map(si => ({
      orderId: si.orderId,
      quantity: Math.round(si.quantity * (newQuantity / totalOld))
    }));

    let actualTotal = updatedSource.reduce((sum, si) => sum + si.quantity, 0);
    const diff = newQuantity - actualTotal;

    if (diff !== 0) {
      updatedSource[0].quantity += diff;
    }

    const updatedItems = orderItems.map(item =>
      item.menuId === editItem.menuId && item.status === editItem.status
        ? { ...item, quantity: newQuantity }
        : item
    );
    setOrderItems(updatedItems);
    setShowEditModal(false);

    axios.get(`http://localhost:9999/orders?tableId=${tableId}`)
      .then(res => {
        const updateRequests = updatedSource.map(us => {
          const order = res.data.find(o => o.id === us.orderId);
          if (!order) return null;

          const updatedOrderItems = order.items.map(i =>
            i.menuId == editItem.menuId && i.status === editItem.status
              ? { ...i, quantity: us.quantity }
              : i
          );

          return axios.put(`http://localhost:9999/orders/${order.id}`, {
            ...order,
            items: updatedOrderItems
          });
        }).filter(Boolean);

        return Promise.all(updateRequests);
      })
      .then(() => {
        setAlertMessage('Updated item quantity successfully.');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        fetchOrders();
      })
      .catch(err => {
        console.error('Update error:', err);
        setOrderItems(originalItems); // rollback nếu lỗi
        setAlertMessage('Failed to update item quantity.');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };


  const handleDelete = (menuId, status) => {
    const item = orderItems.find(item => item.menuId === menuId && item.status === status);
    if (!item || !canEdit(item.status)) {
      setAlertMessage('Only items in "ordered" status can be deleted.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const originalItems = [...orderItems];
    const updatedItems = orderItems.filter(item => !(item.menuId === menuId && item.status === status));
    setOrderItems(updatedItems);
    setAlertMessage('Item has been deleted.');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);

    axios.get(`http://localhost:9999/orders?tableId=${tableId}`)
      .then(res => {
        const updateRequests = res.data.map(order => {
          const hasItem = order.items.some(i => i.menuId == menuId && i.status === status);
          if (!hasItem) return null;

          const updatedItems = order.items.filter(i => !(i.menuId == menuId && i.status === status));
          if (updatedItems.length === 0) {
            return axios.delete(`http://localhost:9999/orders/${order.id}`);
          } else {
            return axios.put(`http://localhost:9999/orders/${order.id}`, {
              ...order,
              items: updatedItems
            });
          }
        }).filter(Boolean);

        return Promise.all(updateRequests);
      })
      .then(() => {
        console.log('Items deleted successfully');
        fetchOrders();
      })
      .catch(err => {
        console.error('Delete error:', err);
        setOrderItems(originalItems);
        setAlertMessage('Failed to delete item on server.');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + getItemPrice(item.menuId) * item.quantity, 0);
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  const handleCheckout = () => {
    const requestData = {
      tableId: tableId,
      time: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }),
      status: 'check-out'
    };

    axios.post('http://localhost:9999/staffCalls', requestData)
      .then(() => {
        setAlertMessage('Thank you! A staff member is on the way with the QR code for payment.');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch(err => {
        console.error('Checkout failed:', err);
        setAlertMessage('Failed to checkout. Please try again.');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Row><Header setUser={setUser} hideSearch={true} /></Row>
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
                    <ListGroup.Item key={`${item.menuId}-${item.status}`} className="d-flex justify-content-between align-items-center py-3 gap-3">
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
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.menuId, item.status)}><Trash2 size={14} /></Button>
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
        <Modal.Header closeButton><Modal.Title>Edit Food Quantity</Modal.Title></Modal.Header>
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